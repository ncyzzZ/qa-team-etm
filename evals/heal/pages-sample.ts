// Fixture for tools/heal/selectors.test.mjs - one locator of each kind, line numbers matter.
export class Sample {
  get row() { return this.page.locator('.b-grid-row'); }
  get save() { return this.page.locator('#saveBtn'); }
  get nameCell() { return this.page.locator('[data-column="name"]'); }
  get scheduled() { return this.page.locator('.b-grid-header-text-content:text-is("Scheduled")'); }
  get savePlan() { return this.page.getByRole('button', { name: 'Save Plan' }); }
  get weekly() { return this.page.getByText('Weekly Plan'); }
  get search() { return this.page.getByPlaceholder('Search'); }
  get remark() { return this.page.getByLabel('Remark'); }
  get gantt() { return this.page.locator('app-shutdown-gantt-chart'); }
  dynamic(t: string) { return this.page.locator(`.cell-${t}`); }
}
