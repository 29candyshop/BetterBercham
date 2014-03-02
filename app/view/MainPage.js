Ext.define('BetterPenang.view.MainPage', {
    extend: 'Ext.List',
    xtype: 'contacts',

    config: {
        title: 'Better Penang',
        cls: 'x-contacts',

        store: 'Contacts',
        itemTpl: [
            '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
            '{firstName} {lastName}',
            '<span>{title}</span>'
        ].join('')
    }
});
