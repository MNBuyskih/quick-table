import Renderer = TableRender.Renderer;
describe('renderer', function () {
    it('should create new renderer instance', function () {
        let renderer = new Renderer([], {
            columns: [
                {label: 'a'},
            ],
        });

        var render = renderer.render();
        expect(typeof render).toBe('string');
        expect(render).toBe('<table><tr><th>a</th></tr></table>');
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

        expect(render).toBe('<table><tr class="test"><th>a</th></tr></table>');
    });

    it('should add class to header cell', () => {
        let renderer = new Renderer([], {
            columns: [{
                label: 'a',
                className: 'test',
            }],
        });
        let render = renderer.render();

        expect(render).toBe('<table><tr><th class="test">a</th></tr></table>');
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

        expect(render).toBe('<table><tr><th>a</th></tr><tr><td>A</td></tr></table>');
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

        expect(render).toBe('<table><tr><th>a</th></tr><tr class="test"><td>A</td></tr></table>');
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

        expect(render).toBe('<table><tr><th>a</th></tr><tr><td class="test">A</td></tr></table>');
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

        expect(render).toBe('<table><tr><th>a</th><th>b</th><th>c</th></tr><tr><td>A</td><td>B</td><td>C</td></tr><tr><td>A</td><td>B</td><td>C</td></tr></table>');
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
});