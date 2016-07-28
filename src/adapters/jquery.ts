module TableRender.Adapters {
    $.fn.QuickTable = function (data, config) {
        let $this = $(this);
        let renderer = new Renderer(data, config);
        renderer.config.afterRender = (renderer, html) => {
            $this.html(html);
            $.each($this.find('.quick-table-sorting'), function (n, el) {
                $(el).on('click', function () {
                    renderer.sorting.setSorting(renderer.config.columns[n]);
                    renderer.render();
                }, false);
            });
            return html;
        };
        renderer.render();
        return renderer;
    }
}