#!/bin/bash
# usage: ov.sh n did see failed? sel...
cd /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm
R=$PWD/work/ETM-8034/manual-run-8868-20261125b
n=$1; did=$2; see=$3; shift 3
args=(); for s in "$@"; do args+=(--sel "$s"); done
node tools/manual/overlay.js --test ETM-8868 --n $n --did "$did" --see "$see" "${args[@]}" --out $R/evidence/ETM-8868/step-$n.png > .playwright-mcp/overlay-ETM-8868-$n.js && echo $PWD/.playwright-mcp/overlay-ETM-8868-$n.js
