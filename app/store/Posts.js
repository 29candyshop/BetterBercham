Ext.define('BetterPenang.store.Posts', {
    extend: 'Ext.data.Store',

    config: {
        model: 'BetterPenang.model.Post',
        autoLoad: true,
        //sorters: 'firstName',
		pageSize: 5,
        grouper: {
            groupFn: function(record) {
                return record.get('lastName')[0];
            }
        },
        proxy: {
            type: 'ajax',
            url: 'resources/json/posts.json'
        }
    }
});
