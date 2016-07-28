import VanillaAdapter = TableRender.Adapters.VanillaAdapter;
describe('vanilla adapter', function () {
    let element;
    beforeEach(() => {
        document.body.innerHTML = '<div id="test"></div>';
        element = $('#test');
    });

    it('should insert html in element', function () {
        VanillaAdapter(element, [], {
            columns: [{key: 'a', label: "a"}],
            sorting: function () {
            }
        });
        expect(element.innerHTML.length > 0).toBe(true);
    });

    it('should attach events', function () {
        VanillaAdapter(element, [], {
            columns: [{key: 'a', label: "a"}],
            sorting: function (data:IRowData[], sorting:ISorting) {
                data.sort((a, b) => {
                    if (!sorting.column) return 0;
                    if (sorting.direction === ISortingDirections.ASC) {
                        return a.values[sorting.column.key].value - b.values[sorting.column.key].value;
                    } else {
                        return b.values[sorting.column.key].value - a.values[sorting.column.key].value;
                    }
                });
            }
        });

        let html = element.innerHTML;
        element.querySelector('.quick-table-sorting').click();
        expect(element.innerHTML).not.toBe(html);

        html = element.innerHTML;
        element.querySelector('.quick-table-sorting').click();
        expect(element.innerHTML).not.toBe(html);
    });
});