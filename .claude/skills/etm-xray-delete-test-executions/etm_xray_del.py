#!/usr/bin/env python3
"""ETM bulk delete helper. Secrets come from env, never printed.
Env: JIRA_EMAIL, JIRA_API_TOKEN, XRAY_CLIENT_ID, XRAY_CLIENT_SECRET
  whoami                                          -> checks Jira + Xray credentials
  folder  <folder path e.g. "/Manual Test/Bin">   -> prints keys in that Xray folder (no sub-folders)
  tree                                            -> prints the Xray folder tree of ETM (find a path)
  check   <JQL>                                   -> prints key|type|status|summary for each match
  delete  [--types "Test Execution,Test"] <KEY> ... -> DELETE each issue whose type is allowed
                                                     (default: Test Execution only), prints result
"""
import base64, json, os, ssl, sys, urllib.request, urllib.error

SITE = "https://pttep.atlassian.net"
XRAY = "https://xray.cloud.getxray.app/api/v2"
CA = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
CTX = ssl.create_default_context(cafile=CA) if CA and os.path.exists(CA) else ssl.create_default_context()


def req(method, url, body=None, headers=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    if data is not None:
        r.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(r, context=CTX, timeout=60) as resp:
            txt = resp.read().decode()
            return resp.status, (json.loads(txt) if txt.strip() else None)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]


def jira(method, path, body=None):
    tok = base64.b64encode(f"{os.environ['JIRA_EMAIL']}:{os.environ['JIRA_API_TOKEN']}".encode()).decode()
    return req(method, SITE + path, body, {"Authorization": "Basic " + tok, "Accept": "application/json"})


def xray_gql(query, variables):
    code, tok = req("POST", XRAY + "/authenticate",
                    {"client_id": os.environ["XRAY_CLIENT_ID"], "client_secret": os.environ["XRAY_CLIENT_SECRET"]})
    if code != 200:
        sys.exit(f"Xray auth failed ({code})")
    code, res = req("POST", XRAY + "/graphql", {"query": query, "variables": variables},
                    {"Authorization": "Bearer " + tok})
    if code != 200 or (isinstance(res, dict) and res.get("errors")):
        sys.exit(f"Xray GraphQL error {code}: {res if isinstance(res, str) else res.get('errors')}")
    return res["data"]


def project_id():
    code, p = jira("GET", "/rest/api/3/project/ETM")
    if code != 200:
        sys.exit(f"Jira auth/project lookup failed ({code})")
    return p["id"]


def search(jql):
    out, token = [], None
    while True:
        body = {"jql": jql, "fields": ["summary", "issuetype", "status"], "maxResults": 100}
        if token:
            body["nextPageToken"] = token
        code, r = jira("POST", "/rest/api/3/search/jql", body)
        if code != 200:
            sys.exit(f"JQL search failed ({code}): {r}")
        out += r.get("issues", [])
        token = r.get("nextPageToken")
        if not token or r.get("isLast"):
            return out


def main():
    cmd, args = sys.argv[1], sys.argv[2:]
    code, me = jira("GET", "/rest/api/3/myself")
    if code != 200:
        sys.exit(f"Jira auth failed ({code}) - check JIRA_EMAIL / JIRA_API_TOKEN")
    if cmd == "whoami":
        print(f"Jira OK as {me.get('displayName')}"); xray_gql('query($p:String!){getFolder(projectId:$p,path:"/"){name}}', {"p": project_id()}); print("Xray OK")
    elif cmd == "tree":
        d = xray_gql('query($p:String!){getFolder(projectId:$p,path:"/"){folders}}', {"p": project_id()})
        def walk(fs, depth=0):
            for f in fs or []:
                print("  " * depth + f"{f.get('path')}  (tests: {f.get('testsCount')}, id: {f.get('id', '-')})")
                walk(f.get("folders"), depth + 1)
        walk(d["getFolder"]["folders"])
    elif cmd == "folder":
        pid, keys, start = project_id(), [], 0
        q = ('query($p:String!,$f:String!,$s:Int!){getTests(projectId:$p,folder:{path:$f,includeDescendants:false},'
             'limit:100,start:$s){total results{jira(fields:["key","issuetype"])}}}')
        while True:
            r = xray_gql(q, {"p": pid, "f": args[0], "s": start})["getTests"]
            keys += [t["jira"]["key"] for t in r["results"]]
            start += 100
            if start >= r["total"]:
                break
        print(f"TOTAL {len(keys)}")
        print(", ".join(keys))
    elif cmd == "check":
        for i in search(args[0]):
            f = i["fields"]
            print(f"{i['key']}|{f['issuetype']['name']}|{f['status']['name']}|{f['summary']}")
    elif cmd == "delete":
        allowed = {"Test Execution"}
        if args and args[0] == "--types":
            allowed = {t.strip() for t in args[1].split(",")}; args = args[2:]
        ok = fail = 0
        for key in args:
            code, r = jira("GET", f"/rest/api/3/issue/{key}?fields=issuetype")
            if code != 200 or r["fields"]["issuetype"]["name"] not in allowed:
                print(f"SKIP {key} (type not allowed or not found: {code})"); fail += 1; continue
            code, r = jira("DELETE", f"/rest/api/3/issue/{key}?deleteSubtasks=true")
            if code == 204:
                print(f"DELETED {key}"); ok += 1
            else:
                print(f"FAILED {key} ({code}): {r}"); fail += 1
        print(f"DONE deleted={ok} skipped/failed={fail}")


if __name__ == "__main__":
    main()
