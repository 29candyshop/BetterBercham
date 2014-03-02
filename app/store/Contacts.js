Ext.define('BetterPenang.store.Contacts', {
    extend: 'Ext.data.Store',

    config: {
        model: 'BetterPenang.model.Contact',
        autoLoad: true,
        sorters: 'firstName',
        grouper: {
            groupFn: function(record) {
                return record.get('lastName')[0];
            }
        },
        proxy: {
            type: 'ajax',
            url: 'resources/json/contacts.json'
        }
    }
});
