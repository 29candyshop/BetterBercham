Ext.define('BetterPenang.model.Post', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'firstName',
            'lastName',
            'headshot',
            'title',
            'telephone',
            'city',
            'state',
            'country',
            'latitude',
            'longitude',
			'description',
			'completetitle',
			'fbid',
			'address'
        ]
    }
});
