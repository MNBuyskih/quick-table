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
});