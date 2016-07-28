import Renderer = TableRender.Renderer;
import ISorting = TableRender.ISorting;
import IRowData = TableRender.IRowData;
import ISortingDirections = TableRender.ISortingDirections;
describe('renderer', function () {
    it('should create new renderer instance', function () {
        let renderer = new Renderer([], {
            columns: [
                {label: 'a'},
            ],
        });

        var render = renderer.render();
        expect(typeof render).toBe('string');
        expect(render).toBe('<table><tr><th><span>a</span></th></tr></table>');
    });

    it('should add class name to table', function () {
        let renderer = new Renderer([], {
            columns: [],
            tableClassName: 'table'
        });
        let render = renderer.render();

        expect(render).toBe('<table class="table"></table>');
    });

    it('should add class to header row', () => {
        let renderer = new Renderer([], {
            columns: [{label: 'a'}],
            headersClassName: 'test'
        });
        let render = renderer.render();

        expect(render).toBe('<table><tr class="test"><th><span>a</span></th></tr></table>');
    });

    it('should add class to header cell', () => {
        let renderer = new Renderer([], {
            columns: [{
                label: 'a',
                className: 'test',
            }],
        });
        let render = renderer.render();

        expect(render).toBe('<table><tr><th class="test"><span>a</span></th></tr></table>');
    });

    it('should generate data', () => {
        let renderer = new Renderer([
            {
                values: {
                    a: {
                        value: 'A'
                    }
                }
            }
        ], {
            columns: [{label: 'a', key: 'a'}],
        });
        let render = renderer.render();

        expect(render).toBe('<table><tr><th><span>a</span></th></tr><tr><td>A</td></tr></table>');
    });

    it('should add class to data row', () => {
        let renderer = new Renderer([
            {
                values: {
                    a: {
                        value: 'A'
                    }
                },
                className: 'test'
            }
        ], {
            columns: [{label: 'a', key: 'a'}],
        });
        let render = renderer.render();

        expect(render).toBe('<table><tr><th><span>a</span></th></tr><tr class="test"><td>A</td></tr></table>');
    });

    it('should add class to data cell', () => {
        let renderer = new Renderer([
            {
                values: {
                    a: {
                        value: 'A',
                        className: 'test'
                    }
                },
            }
        ], {
            columns: [{label: 'a', key: 'a'}],
        });
        let render = renderer.render();

        expect(render).toBe('<table><tr><th><span>a</span></th></tr><tr><td class="test">A</td></tr></table>');
    });

    it('should render multiple rows and cols', () => {
        let renderer = new Renderer([
            {
                values: {
                    a: {value: "A"},
                    b: {value: "B"},
                    c: {value: "C"},
                }
            },
            {
                values: {
                    a: {value: "A"},
                    b: {value: "B"},
                    c: {value: "C"},
                }
            }
        ], {
            columns: [
                {label: 'a', key: 'a'},
                {label: 'b', key: 'b'},
                {label: 'c', key: 'c'},
            ]
        });
        let render = renderer.render();

        expect(render).toBe('<table><tr><th><span>a</span></th><th><span>b</span></th><th><span>c</span></th></tr><tr><td>A</td><td>B</td><td>C</td></tr><tr><td>A</td><td>B</td><td>C</td></tr></table>');
    });

    describe('events', function () {
        it('should fire before render', function (done) {
            let renderer = new Renderer([], {
                columns: [],
                beforeRender: function (rend) {
                    expect(renderer).toBe(rend);
                    done();
                }
            });
            renderer.render();
        });

        it('should fire after render', function () {
            let renderer = new Renderer([], {
                columns: [],
                afterRender: function (rend, html) {
                    expect(renderer).toBe(rend);
                    expect(html).toBe('<table></table>');
                    return 'replaced html';
                }
            });
            let html = renderer.render();
            expect(html).toBe('replaced html');
        });

        it('should fire before row render', function (done) {
            let renderer = new Renderer([
                {
                    values: {
                        a: {value: "A"},
                        b: {value: "B"},
                        c: {value: "C"},
                    }
                }
            ], {
                columns: [],
                beforeRowRender: function (rend, data) {
                    let rowData = TableRender.RowData;
                    expect(renderer).toBe(rend);
                    expect(data instanceof rowData).toBeTruthy();
                    done();
                }
            });
            renderer.render();
        });

        it('should fire after row render', function () {
            let renderer = new Renderer([
                {
                    values: {
                        a: {value: "A"},
                        b: {value: "B"},
                        c: {value: "C"},
                    }
                }
            ], {
                columns: [],
                afterRowRender: function (rend, html) {
                    expect(renderer).toBe(rend);
                    expect(html).toBe('');
                    return 'replaced html';
                }
            });
            let html = renderer.render();
            expect(html).toBe('<table>replaced html</table>');
        });

    });

    describe('cache', function () {
        it('should cache row', function () {
            let render = new Renderer([
                {values: {a: {value: 'A'}}}
            ], {
                columns: [{label: 'a', key: 'a'}]
            });
            render.render();
            expect(render.data[0].cache.getValue()).toBeTruthy();
        });

        it('should cache cell', function () {
            let render = new Renderer([
                {values: {a: {value: 'A'}}}
            ], {
                columns: [{label: 'a', key: 'a'}]
            });
            render.render();
            expect(render.data[0].values.a.cache.getValue()).toBeTruthy();
        });

        it('should reset cache', function () {
            let render = new Renderer([
                {values: {a: {value: 'A'}}}
            ], {
                columns: [{label: 'a', key: 'a'}]
            });
            render.render();
            render.resetCache();
            expect(render.data[0].cache.getValue()).toBeNull();
            expect(render.data[0].values.a.cache.getValue()).toBeNull();
        });
    });

    describe('sorting', function () {
        it('should add class to header cells', function () {
            let render = new Renderer([], {
                columns: [{label: 'a', key: 'a'}],
                sorting: function (data:IRowData[], sorting:ISorting) {

                }
            });
            let html = render.render();
            expect(html.indexOf('<th><span class="quick-table-sorting') > -1).toBe(true);
        });

        it('should add `asc` class to header cells', function () {
            let render = new Renderer([], {
                columns: [{label: 'a', key: 'a'}],
                sortingDefault: {
                    column: 'a',
                    direction: ISortingDirections.ASC,
                },
                sorting: function (data:IRowData[], sorting:ISorting) {

                }
            });
            let html = render.render();
            expect(html.indexOf('<th><span class="quick-table-sorting quick-table-sorting-asc">') > -1).toBe(true);
        });

        it('should be reordered', function () {
            let render = new Renderer([], {
                columns: [{label: 'a', key: 'a'}],
                sorting: function (data:IRowData[], sorting:ISorting) {

                }
            });
            let html = render.render();
            expect(html.indexOf('<th><span class="quick-table-sorting">') > -1).toBe(true);

            render.sorting.setSorting(render.config.columns[0], ISortingDirections.DESC);
            html = render.render();
            expect(html.indexOf('<th><span class="quick-table-sorting quick-table-sorting-desc">') > -1).toBe(true);
        });

        it('should reorder', function () {
            let renderer = new Renderer([
                {
                    values: {
                        a: {value: "1"},
                        b: {value: "2"},
                        c: {value: "3"},
                    }
                },
                {
                    values: {
                        a: {value: "4"},
                        b: {value: "5"},
                        c: {value: "6"},
                    }
                }
            ], {
                columns: [
                    {label: 'a', key: 'a'},
                    {label: 'b', key: 'b'},
                    {label: 'c', key: 'c'},
                ],
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
            let render = renderer.render();

            expect(render).toBe('<table><tr><th><span class="quick-table-sorting">a</span></th><th><span class="quick-table-sorting">b</span></th><th><span class="quick-table-sorting">c</span></th></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr></table>')

            renderer.sorting.setSorting(renderer.config.columns[1]);
            render = renderer.render();
            expect(render).toBe('<table><tr><th><span class="quick-table-sorting">a</span></th><th><span class="quick-table-sorting quick-table-sorting-asc">b</span></th><th><span class="quick-table-sorting">c</span></th></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr></table>')

            renderer.sorting.setSorting(renderer.config.columns[1], ISortingDirections.DESC);
            render = renderer.render();
            expect(render).toBe('<table><tr><th><span class="quick-table-sorting">a</span></th><th><span class="quick-table-sorting quick-table-sorting-desc">b</span></th><th><span class="quick-table-sorting">c</span></th></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>1</td><td>2</td><td>3</td></tr></table>')
        });
    });
});