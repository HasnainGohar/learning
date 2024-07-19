
export const bankDetails = [
    {
        label: 'Bank Name',
        key: 'bankName',
    },
    {
        label: 'Account Holder Name',
        key: 'accountHolderName',
    },
    {
        label: 'Account Number',
        key: 'accountNumber',
    },
    {
        label: 'Account Type',
        key: 'accountType',
    },
    {
        label: 'Country',
        key: 'country',
    },
    {
        label: 'Security Code',
        key: 'securityCode',
    },
    {
        label: 'Postal Code',
        key: 'postalCode',
    },
    {
        label: 'Salary Date',
        mode: 'date',
        type: 'datetime',
        key: 'salaryDate',
    },
]

export const contactdetails = [
    
    {
        label: 'Phone',
        keyboard: 'phone-pad',
        key: 'phone'
    },
    {
        label: 'NI Number',
        key: 'nino'
    },
    {
        label: 'City',
        key: 'city'
    },
    {
        label: 'Address',
        key: 'address'
    },
    {
        label: 'Emergency Contact Deatils',
        key: 'ecd',
        line: 4
    },
]

export const Passport = [
    {
        label: 'Passport Pictures',
        type: 'image',
        key: 'images',
        multiImage:true
    },
    {
        label: 'Issue Date',
        type: 'datetime',
        key: 'issueDate',
        mode: 'date',
        required: true

    },
    {
        label: 'Expiry Date',
        type: 'datetime',
        key: 'expiryDate',
        mode: 'date',
        required: true

    },
    {
        label: 'Nationality',
        key: 'nationality'
    },
]

export const visa = [
    {
        label: 'Visa Picture',
        type: 'image',
        key: 'images',
        multiImage:true
    },
    {
        label: 'Issue Date',
        type: 'datetime',
        key: 'issueDate',
        mode: 'date',
        required: true

    },
    {
        label: 'Expiry Date',
        type: 'datetime',
        key: 'expiryDate',
        mode: 'date',
        required: true

    },
    {
        label: 'Category',
        key: 'category'
    },
    {
        label: 'status',
        key: 'status'
    },
]

export const education = [
    {
        label: 'Profile Picture',
        type: 'image',
        key: 'image'
    },
    {
        label: 'Degree',
        key: 'degree',
        required: true
    },
    {
        label: 'Qualification',
        key: 'qualification'
    },
    {
        label: 'Year',
        keyboard: 'phone-pad',
        key: 'year'
    },
    {
        label: 'Grade',
        key: 'grade'
    }
]

export const complinceDocuments = [
    {
        label: 'Pictures',
        type: 'image',
        key: 'images',
        multiImage:true
    },
    {
        label: 'Issue Date',
        type: 'datetime',
        key: 'issueDate',
        mode: 'date',
        required: true

    },
    {
        label: 'Expiry Date',
        type: 'datetime',
        key: 'expiryDate',
        mode: 'date',
        required: true

    },
    {
        label: 'Status',
        key: 'status',
    },
    {
        label: 'Required Notification',
        key: 'notification',
        type: 'multiSelect',
        values: [
            { notification: '15 days', label: '15 days' },
            { notification: '1 Month', label: '1 Month' },
            { notification: '2 Months', label: '2 Months' },
            { notification: '3 Months', label: '3 Months' },
        ],
        selectLabel:'label'
    },
    {
        label: 'Category',
        key: 'category'
    },

]