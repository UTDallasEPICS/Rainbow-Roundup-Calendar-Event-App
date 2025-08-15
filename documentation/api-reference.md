# ITEM

## GET with URL Param

#### Endpoint
API located at api/item/[id] where id is the ID of the item you are trying to retrieve

#### Request Specification
Content-Type: None<br>
Body: None

#### Response Specification
Content-Type: application/json<br>
Body:
```
    {
        success: <true or false>,
        data?: {
            id: <item ID>,
            name: <item Name>,
            FinishedItems: [
                {
                    id: <finishedItem ID>,
                    quantity: <number>,
                    size: <size string>,
                    price: <number>,
                    itemId: <ID of parent item>
                },
                ...
            ],
            ItemPhotos: [
                {
                    id: <itemPhoto ID>,
                    url: <S3 bucket url of photo>,
                    itemID: <ID of parent item>
                }
            ]
        },
        error?: <error message>
    }
```

## DELETE with URL Param

#### Endpoint 
API located at api/item/[id] where id is the ID of the item you are trying to delete

#### Request Specification 
Content-Type: None<br>
Body: None 

#### Response Specification 
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    message?: <success message>,
    error?: <error message>
}
```

#### Example Success: 
```
{
    success: true,
    message: "Item and its related finishedItems and itemPhotos deleted successfully"
}
```

#### Example Error: 
```
{
    success: false,
    error: "Item not found"
}
```

## PUT with URL Param

#### Endpoint 
API located at api/item/[id] where id is the ID of the item you are updating 

#### Request Specification 
Content-Type: application/json<br>
Body: 
```
{
    name?: <string>,                    // optional: updates item name
    finishedItems?: [                   // optional: replaces ALL existing FinishedItems
        {
            quantity: <number>,         // required if array present
            size: <"XXS"|"XS"|"S"|"M"|"L"|"XL"|"XXL"|"XXXL">,
            price: <number>
        },
        ...
    ]
}
```

#### Response Specification
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    data?: {
        id: <item ID>,
        name: <item name>,
        FinishedItems: [
            {
                id: <finishedItem ID>,
                quantity: <number>,
                size: <size string>,
                price: <number>,
                itemId: <ID of parent item>
            },
            ...
        ]
    },
    error?: <error message>
}
```

## GET 

#### Endpoint 
API located at api/item -- returns all items 

#### Request Specification
Content-Type: None<br>
Body: None

#### Response Specification 
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    data?: [
        {
            id: <item ID>,
            name: <item name>,
            FinishedItems: [
                {
                    id: <finishedItem ID>,
                    quantity: <number>,
                    size: <"XXS"|"XS"|"S"|"M"|"L"|"XL"|"XXL"|"XXXL">,
                    price: <number>,
                    itemId: <ID of parent item>
                },
                ...
            ],
            ItemPhotos: [
                {
                    id: <itemPhoto ID>,
                    url: <S3 bucket url of photo>,
                    itemId: <ID of parent item>
                },
                ...
            ]
        },
        ...
    ],
    error?: <error message>
}
```

## POST 

#### Endpoint 
API located at api/item -- creates a new item and its finishedItems 

#### Request Specification 
Content-Type: application/json<br>
Body: 
```
{
    name: <string>,
    finishedItems: [
        {
            quantity: <number>,
            size: <"XXS"|"XS"|"S"|"M"|"L"|"XL"|"XXL"|"XXXL">,
            price: <number>
        },
        ...
    ]
}
```

#### Response Specification
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    data?: {
        id: <item ID>,
        name: <item name>,
        FinishedItems: [
            {
                id: <finishedItem ID>,
                quantity: <number>,
                size: <size string>,
                price: <number>,
                itemId: <ID of parent item>
            },
            ...
        ]
    },
    error?: <error message>
}
```

# ITEM PHOTO 

## DELETE with URL Param 

#### Endpoint 
API located at api/itemPhoto/[id] where id is the ID of the itemPhoto you are trying to delete 

#### Request Specification
Content-Type: None<br>
Body: None 

#### Response Specification
Content-Type: application/json<br>
Body:
```
{
    success: <true or false>,
    itemPhoto?: {
        id: <itemPhoto ID>,
        url: <S3 bucket url of photo>,
        itemId: <ID of parent item>
    },
    error?: <error message>
}
```

## POST with URL Param 

#### Endpoint 
API located at api/itemPhoto/[id] where id is the parent item's ID you are attaching the photo to

#### Request Specification 
Content-Type: multipart/form-data<br>
Body:
```
    name="image"
    <image file>
```

#### Response Specification 
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    data?: {
        id: <itemPhoto ID>,
        url: <S3 bucket url of photo>,
        itemId: <ID of parent item>
    },
    error?: <error message>
}
```

# ORDER 

## DELETE with URL Param 

#### Endpoint
API located at api/order/[id] where id is the ID of the order you are trying to delete 

#### Request Specification 
Content-Type: None<br>
Body: None

#### Response Specification 
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    message?: <success message>,
    error?: <error message>
}
```

## GET with URL Param 

#### Endpoint 
API located at api/order/[id] where id is the User ID whose orders you want to retrieve 

#### Request Specification 
Content-Type: None<br>
Body: None 

#### Response Specification 
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    data?: [
        {
            id: <order ID>,
            userId: <user ID>,
            /* ...other order fields... */
            OrderItems: [
                {
                    id: <orderItem ID>,
                    /* ...other orderItem fields... */
                    FinishedItems: {
                        id: <finishedItem ID>,
                        quantity: <number>,
                        size: <"XXS"|"XS"|"S"|"M"|"L"|"XL"|"XXL"|"XXXL">,
                        price: <number>,
                        itemId: <ID of parent item>,
                        item: {
                            id: <item ID>,
                            name: <item name>
                        }
                    }
                },
                ...
            ]
        },
        ...
    ],
    error?: <error message>
}
```

## PUT with URL Param 

#### Endpoint 
API located at api/order/[id] where id is the ID of the order you are updating 

#### Request Specification 
Content-Type: application/json<br>
Body: 
```
{
    status?: <string>,               // optional
    paymentInfo?: <string>,          // optional
    orderItems?: [                   // optional: REPLACES all existing order items
        { finishedItemsId: <string> },
        ...
    ]
}
```

#### Response Specification 
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    data?: {
        id: <order ID>,
        userId: <user ID>,
        status: <string>,
        paymentInfo: <string>,
        /* ...other order fields... */
        OrderItems: [
            {
                id: <orderItem ID>,
                finishedItemsId: <string>,
                /* ...other orderItem fields... */
                FinishedItems: {
                    id: <finishedItem ID>,
                    quantity: <number>,
                    size: <"XXS"|"XS"|"S"|"M"|"L"|"XL"|"XXL"|"XXXL">,
                    price: <number>,
                    itemId: <ID of parent item>,
                    item: {
                        id: <item ID>,
                        name: <item name>
                    }
                }
            },
            ...
        ]
    },
    error?: <error message>
}
```

## GET 

#### Endpoint 
API located at api/order -- returns all orders

#### Request Specification 
Content-Type: None<br>
Body: None 

#### Response Specification 
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    data?: [
        {
            id: <order ID>,
            userId: <user ID>,
            status: <string>,
            paymentInfo: <string>,
            /* ...other order fields... */
            OrderItems: [
                {
                    id: <orderItem ID>,
                    finishedItemsId: <string>,
                    /* ...other orderItem fields... */
                    FinishedItems: {
                        id: <finishedItem ID>,
                        quantity: <number>,
                        size: <"XXS"|"XS"|"S"|"M"|"L"|"XL"|"XXL"|"XXXL">,
                        price: <number>,
                        itemId: <ID of parent item>,
                        item: {
                            id: <item ID>,
                            name: <item name>
                        }
                    }
                },
                ...
            ]
        },
        ...
    ],
    error?: <error message>
}
```

## POST

#### Endpoint 
API located at api/order -- creates a new order with its order items 

#### Request Specification 
Content-Type: application/json<br>
Body: 
```
{
    userId: <string>,
    status: <string>,
    paymentInfo?: <string>,         // optional
    orderItems: [
        { finishedItemsId: <string> },
        ...
    ]
}
```

#### Response Specification 
Content-Type: application/json<br>
Body: 
```
{
    success: <true or false>,
    data?: {
        id: <order ID>,
        userId: <user ID>,
        status: <string>,
        paymentInfo: <string|null>,
        OrderItems: [
            {
                id: <orderItem ID>,
                finishedItemsId: <string>,
                FinishedItems: {
                    id: <finishedItem ID>,
                    quantity: <number>,
                    size: <"XXS"|"XS"|"S"|"M"|"L"|"XL"|"XXL"|"XXXL">,
                    price: <number>,
                    itemId: <item ID>,
                    item: {
                        id: <item ID>,
                        name: <item name>
                    }
                }
            },
            ...
        ]
    },
    error?: <error message>
}
```