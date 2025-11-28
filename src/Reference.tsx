import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';

// Reference file - example transaction data structure
// This file is kept for reference purposes

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const test = async () => {
    // create a client connected to devnet
    const client = new SuiJsonRpcClient({
      url: 'https://fullnode.mainnet.sui.io:443',
    });
    let digest = 'BNZJ3RWCNYCDB8vwhEMn3ihifZNebCeid9GyEG2quWfz';
    const res = await client.getTransactionBlock({
      digest,
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
        showBalanceChanges: true
      }
    });
    console.log(res);
  };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const exampleOutput = {
    "digest": "BNZJ3RWCNYCDB8vwhEMn3ihifZNebCeid9GyEG2quWfz",
    "transaction": {
        "data": {
            "messageVersion": "v1",
            "transaction": {
                "kind": "ProgrammableTransaction",
                "inputs": [
                    {
                        "type": "object",
                        "objectType": "sharedObject",
                        "objectId": "0x27c4fdb3b846aa3ae4a65ef5127a309aa3c1f466671471a806d8912a18b253e8",
                        "initialSharedVersion": "414947421",
                        "mutable": true
                    },
                    {
                        "type": "object",
                        "objectType": "sharedObject",
                        "objectId": "0x08aa68cf0d865924df66611635885686f420bde78d8eb8a9741bc97ff0c715ff",
                        "initialSharedVersion": "393168550",
                        "mutable": true
                    },
                    {
                        "type": "object",
                        "objectType": "immOrOwnedObject",
                        "objectId": "0x85e90d21add7091e681bcdabd530dccc14a700e6985cffd3ee1bb0b06ca25b12",
                        "version": "700541591",
                        "digest": "B73cfcUf8U6hkyWgSL1X8JK6eSWxt86bKowjKGSGb3R4"
                    },
                    {
                        "type": "object",
                        "objectType": "sharedObject",
                        "objectId": "0x0000000000000000000000000000000000000000000000000000000000000006",
                        "initialSharedVersion": "1",
                        "mutable": false
                    },
                    {
                        "type": "pure",
                        "valueType": "u64",
                        "value": "10035409013204225264"
                    },
                    {
                        "type": "pure",
                        "valueType": "u8",
                        "value": 3
                    },
                    {
                        "type": "pure",
                        "valueType": "bool",
                        "value": true
                    },
                    {
                        "type": "pure",
                        "valueType": "u64",
                        "value": "28520000000"
                    },
                    {
                        "type": "pure",
                        "valueType": "u64",
                        "value": "6523000000"
                    },
                    {
                        "type": "pure",
                        "valueType": "u64",
                        "value": "1764265074581"
                    }
                ],
                "transactions": [
                    {
                        "MoveCall": {
                            "package": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809",
                            "module": "balance_manager",
                            "function": "generate_proof_as_trader",
                            "arguments": [
                                {
                                    "Input": 1
                                },
                                {
                                    "Input": 2
                                }
                            ]
                        }
                    },
                    {
                        "MoveCall": {
                            "package": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809",
                            "module": "pool",
                            "function": "place_limit_order",
                            "type_arguments": [
                                "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
                                "0x2::sui::SUI"
                            ],
                            "arguments": [
                                {
                                    "Input": 0
                                },
                                {
                                    "Input": 1
                                },
                                {
                                    "Result": 0
                                },
                                {
                                    "Input": 4
                                },
                                {
                                    "Input": 5
                                },
                                {
                                    "Input": 6
                                },
                                {
                                    "Input": 7
                                },
                                {
                                    "Input": 8
                                },
                                {
                                    "Input": 6
                                },
                                {
                                    "Input": 6
                                },
                                {
                                    "Input": 9
                                },
                                {
                                    "Input": 3
                                }
                            ]
                        }
                    }
                ]
            },
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "gasData": {
                "payment": [
                    {
                        "objectId": "0x11ed725983a25ebb3e4e4079cc87ceba9ae10bd548f4d29fbc0c7d2670dbc0a6",
                        "version": 700541591,
                        "digest": "3duVJX8hxPzqLSUx6Z4auiRJ5gFyrRoBMNcqi79XH8rq"
                    }
                ],
                "owner": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
                "price": "530",
                "budget": "10000000"
            }
        },
        "txSignatures": [
            "AF20MXQ9eddcvlyDU7JWbqVXqtdy6b5cDYmA5vNyRACnjKxheoJwiiminAk+mdRsoLRDLYBYSn1b0ln9IIs3aAWqZI9GdOskOMsV3Z6m0a+EXT14pcbJIKTJM2kviJdUCw=="
        ]
    },
    "effects": {
        "messageVersion": "v1",
        "status": {
            "status": "success"
        },
        "executedEpoch": "959",
        "gasUsed": {
            "computationCost": "530000",
            "storageCost": "106027600",
            "storageRebate": "103981680",
            "nonRefundableStorageFee": "1050320"
        },
        "modifiedAtVersions": [
            {
                "objectId": "0x06e66c1bc0d61db3201d15a879735842c7f3d17ec1885b8939719b95333f4cb2",
                "sequenceNumber": "700541599"
            },
            {
                "objectId": "0x08aa68cf0d865924df66611635885686f420bde78d8eb8a9741bc97ff0c715ff",
                "sequenceNumber": "700541599"
            },
            {
                "objectId": "0x11ed725983a25ebb3e4e4079cc87ceba9ae10bd548f4d29fbc0c7d2670dbc0a6",
                "sequenceNumber": "700541591"
            },
            {
                "objectId": "0x153e0ecf094ee4cd56d4267599f6b9648458ad798b49bc728a60556f30920a91",
                "sequenceNumber": "700541599"
            },
            {
                "objectId": "0x27c4fdb3b846aa3ae4a65ef5127a309aa3c1f466671471a806d8912a18b253e8",
                "sequenceNumber": "700541612"
            },
            {
                "objectId": "0x2b7499616c8e37b589d1feb9770f342dcbe25ba9dde1abffca22f2e08f20dd0e",
                "sequenceNumber": "700541612"
            },
            {
                "objectId": "0x84f38798fdfceb3eb1c721bfdda57c76e3aaae4985ef202f21bde1d5d4a53c8f",
                "sequenceNumber": "700541612"
            },
            {
                "objectId": "0x85e90d21add7091e681bcdabd530dccc14a700e6985cffd3ee1bb0b06ca25b12",
                "sequenceNumber": "700541591"
            },
            {
                "objectId": "0xc0f471030ea348748ab8e861cecbe87c4a977ec2dcd96fe68a8c91e67781f008",
                "sequenceNumber": "700541599"
            }
        ],
        "sharedObjects": [
            {
                "objectId": "0x08aa68cf0d865924df66611635885686f420bde78d8eb8a9741bc97ff0c715ff",
                "version": 700541599,
                "digest": "8Kiht33WKwnCXGbEphonhfEasxxCoXNKAJi86oSrSLUL"
            },
            {
                "objectId": "0x27c4fdb3b846aa3ae4a65ef5127a309aa3c1f466671471a806d8912a18b253e8",
                "version": 700541612,
                "digest": "8AUVJW4eJMVSCXfYuHjSPucYBPUJmNyFaRuMrqdgxeZ6"
            },
            {
                "objectId": "0x0000000000000000000000000000000000000000000000000000000000000006",
                "version": 641937226,
                "digest": "6xdezCMRQb4QNuHdBtMdrF5tW3V7DXziu1uTFPh6MQk1"
            }
        ],
        "transactionDigest": "BNZJ3RWCNYCDB8vwhEMn3ihifZNebCeid9GyEG2quWfz",
        "mutated": [
            {
                "owner": {
                    "ObjectOwner": "0x796ce8400fa0d89b7ed5eea790985ef0eb7963d64626c24212faee2fe0c69f3a"
                },
                "reference": {
                    "objectId": "0x06e66c1bc0d61db3201d15a879735842c7f3d17ec1885b8939719b95333f4cb2",
                    "version": 700541613,
                    "digest": "76Uq3Xx3cBPGYuKdTvWKuFU2SUQQTVDsz1AyFcVEU3xc"
                }
            },
            {
                "owner": {
                    "Shared": {
                        "initial_shared_version": 393168550
                    }
                },
                "reference": {
                    "objectId": "0x08aa68cf0d865924df66611635885686f420bde78d8eb8a9741bc97ff0c715ff",
                    "version": 700541613,
                    "digest": "5YxgapqUFq2AYVc4PzX6uAb7p9XBbWG4R1EkmGD8Hshx"
                }
            },
            {
                "owner": {
                    "AddressOwner": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd"
                },
                "reference": {
                    "objectId": "0x11ed725983a25ebb3e4e4079cc87ceba9ae10bd548f4d29fbc0c7d2670dbc0a6",
                    "version": 700541613,
                    "digest": "9q8RNaS7wrvWHRrUpD36CxX7mbgSeAQM1oWQgVTkN2F"
                }
            },
            {
                "owner": {
                    "ObjectOwner": "0x3eef96cc53dfd31459db1d6478f7fc055e36eb1b926801801b56dbdc17ff3231"
                },
                "reference": {
                    "objectId": "0x153e0ecf094ee4cd56d4267599f6b9648458ad798b49bc728a60556f30920a91",
                    "version": 700541613,
                    "digest": "Hfd8YLNr3ZVRVpN3E5SJN2TvxD8KnLLn5LqfDGB3GH2F"
                }
            },
            {
                "owner": {
                    "Shared": {
                        "initial_shared_version": 414947421
                    }
                },
                "reference": {
                    "objectId": "0x27c4fdb3b846aa3ae4a65ef5127a309aa3c1f466671471a806d8912a18b253e8",
                    "version": 700541613,
                    "digest": "9TbTffNAbhQPMCLgF9yZk5dpDEfQm7aXALdo6pQrwM2h"
                }
            },
            {
                "owner": {
                    "ObjectOwner": "0xa3085a57f827e5bf2f49eea097c4c02b62fd142fd3386e361c863b9b455d0574"
                },
                "reference": {
                    "objectId": "0x2b7499616c8e37b589d1feb9770f342dcbe25ba9dde1abffca22f2e08f20dd0e",
                    "version": 700541613,
                    "digest": "5zVPgUm2U3kFbKiYU9sHDVMYENctiNxz1C5GYw6vjnXZ"
                }
            },
            {
                "owner": {
                    "ObjectOwner": "0xda8154e9e54fd77dde91904419be34b647437d7f425e7d34f8d67c582da460df"
                },
                "reference": {
                    "objectId": "0x84f38798fdfceb3eb1c721bfdda57c76e3aaae4985ef202f21bde1d5d4a53c8f",
                    "version": 700541613,
                    "digest": "FJMjBRBHNbaT4Z7qtU6FupkPtVZL87tCr4BhAnhGKPbr"
                }
            },
            {
                "owner": {
                    "AddressOwner": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd"
                },
                "reference": {
                    "objectId": "0x85e90d21add7091e681bcdabd530dccc14a700e6985cffd3ee1bb0b06ca25b12",
                    "version": 700541613,
                    "digest": "4Lv8bULUKwcyAJzab6rTMBLbYsdrHJCzCvKiokVt8R6Q"
                }
            },
            {
                "owner": {
                    "ObjectOwner": "0x796ce8400fa0d89b7ed5eea790985ef0eb7963d64626c24212faee2fe0c69f3a"
                },
                "reference": {
                    "objectId": "0xc0f471030ea348748ab8e861cecbe87c4a977ec2dcd96fe68a8c91e67781f008",
                    "version": 700541613,
                    "digest": "DimmRooRrEtX24fxM3dzS8qG7HBmKc75dKG9JEjk49GR"
                }
            }
        ],
        "gasObject": {
            "owner": {
                "AddressOwner": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd"
            },
            "reference": {
                "objectId": "0x11ed725983a25ebb3e4e4079cc87ceba9ae10bd548f4d29fbc0c7d2670dbc0a6",
                "version": 700541613,
                "digest": "9q8RNaS7wrvWHRrUpD36CxX7mbgSeAQM1oWQgVTkN2F"
            }
        },
        "eventsDigest": "8h5scJ7pK64t4fscp3agQeGtv9tveUgvtfzot54UfkyN",
        "dependencies": [
            "5Bos8ctxgyvXQAeyCG5CmvhXTrZkCHAwADwMuSxBr2pv",
            "6v1shyaWJaFaKrUVQueW4eS2iHEsMAtrF9mKZoq5whbU",
            "7Lc5pPSAPRHxH7QNdTeswuwTJPp4sMe4Z1gUotuX7NWp",
            "8LYpnpYfXKpEfvkta3UhqJBotq9JdMSeBktuu7uPnMEV",
            "ADPWQdydqRgRZKi69YKC1yzY7Nj5JunTEAFJw1j1GocL",
            "DCgz4D66b1L5vdG6pDuZB4YSDk3eUshGJLgqzNj5upWF",
            "HgNZBJfnTbN1cfmb8juxQ9Nf68uxSqf1iHX7TqkUcTRi"
        ]
    },
    "events": [
        {
            "id": {
                "txDigest": "BNZJ3RWCNYCDB8vwhEMn3ihifZNebCeid9GyEG2quWfz",
                "eventSeq": "0"
            },
            "packageId": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809",
            "transactionModule": "pool",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "type": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::order_info::OrderPlaced",
            "parsedJson": {
                "balance_manager_id": "0x08aa68cf0d865924df66611635885686f420bde78d8eb8a9741bc97ff0c715ff",
                "client_order_id": "10035409013204225264",
                "expire_timestamp": "1764265074581",
                "is_bid": true,
                "order_id": "526101141000643156162014999803",
                "placed_quantity": "6523000000",
                "pool_id": "0x27c4fdb3b846aa3ae4a65ef5127a309aa3c1f466671471a806d8912a18b253e8",
                "price": "28520000000",
                "timestamp": "1764264774627",
                "trader": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd"
            },
            "bcsEncoding": "base64",
            "bcs": "CKpozw2GWSTfZmEWNYhWhvQgveeNjripdBvJf/DHFf8nxP2zuEaqOuSmXvUSejCao8H0ZmcUcagG2JEqGLJT6Pv0If//////AKrsowYAAADwjMrfU+9EixpmuYb26TjJ9tTPe5jJfDMRZcrVdZ4T+7sd7gFyiEHdAKrsowYAAAABwBTNhAEAAACVn2TGmgEAAOMLYMaaAQAA"
        },
        {
            "id": {
                "txDigest": "BNZJ3RWCNYCDB8vwhEMn3ihifZNebCeid9GyEG2quWfz",
                "eventSeq": "1"
            },
            "packageId": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809",
            "transactionModule": "pool",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "type": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::order_info::OrderInfo",
            "parsedJson": {
                "balance_manager_id": "0x08aa68cf0d865924df66611635885686f420bde78d8eb8a9741bc97ff0c715ff",
                "client_order_id": "10035409013204225264",
                "cumulative_quote_quantity": "0",
                "epoch": "959",
                "executed_quantity": "0",
                "expire_timestamp": "1764265074581",
                "fee_is_deep": true,
                "fill_limit_reached": false,
                "fills": [],
                "is_bid": true,
                "maker_fees": "2963421",
                "market_order": false,
                "order_deep_price": {
                    "asset_is_base": false,
                    "deep_per_asset": "31858589"
                },
                "order_id": "526101141000643156162014999803",
                "order_inserted": true,
                "order_type": 3,
                "original_quantity": "6523000000",
                "paid_fees": "0",
                "pool_id": "0x27c4fdb3b846aa3ae4a65ef5127a309aa3c1f466671471a806d8912a18b253e8",
                "price": "28520000000",
                "self_matching_option": 1,
                "status": 0,
                "timestamp": "1764264774627",
                "trader": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd"
            },
            "bcsEncoding": "base64",
            "bcs": "J8T9s7hGqjrkpl71EnowmqPB9GZnFHGoBtiRKhiyU+j79CH//////wCq7KMGAAAACKpozw2GWSTfZmEWNYhWhvQgveeNjripdBvJf/DHFf/wjMrfU+9EixpmuYb26TjJ9tTPe5jJfDMRZcrVdZ4T+7sd7gFyiEHdAwEAquyjBgAAAAHAFM2EAQAAAACdH+YBAAAAAJWfZMaaAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAADdNy0AAAAAAL8DAAAAAAAAAAAAAeMLYMaaAQAA"
        }
    ],
    "objectChanges": [
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "ObjectOwner": "0x796ce8400fa0d89b7ed5eea790985ef0eb7963d64626c24212faee2fe0c69f3a"
            },
            "objectType": "0x2::dynamic_field::Field<0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::balance_manager::BalanceKey<0x2::sui::SUI>, 0x2::balance::Balance<0x2::sui::SUI>>",
            "objectId": "0x06e66c1bc0d61db3201d15a879735842c7f3d17ec1885b8939719b95333f4cb2",
            "version": "700541613",
            "previousVersion": "700541599",
            "digest": "76Uq3Xx3cBPGYuKdTvWKuFU2SUQQTVDsz1AyFcVEU3xc"
        },
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "Shared": {
                    "initial_shared_version": 393168550
                }
            },
            "objectType": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::balance_manager::BalanceManager",
            "objectId": "0x08aa68cf0d865924df66611635885686f420bde78d8eb8a9741bc97ff0c715ff",
            "version": "700541613",
            "previousVersion": "700541599",
            "digest": "5YxgapqUFq2AYVc4PzX6uAb7p9XBbWG4R1EkmGD8Hshx"
        },
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "AddressOwner": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd"
            },
            "objectType": "0x2::coin::Coin<0x2::sui::SUI>",
            "objectId": "0x11ed725983a25ebb3e4e4079cc87ceba9ae10bd548f4d29fbc0c7d2670dbc0a6",
            "version": "700541613",
            "previousVersion": "700541591",
            "digest": "9q8RNaS7wrvWHRrUpD36CxX7mbgSeAQM1oWQgVTkN2F"
        },
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "ObjectOwner": "0x3eef96cc53dfd31459db1d6478f7fc055e36eb1b926801801b56dbdc17ff3231"
            },
            "objectType": "0x2::dynamic_field::Field<0x2::object::ID, 0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::account::Account>",
            "objectId": "0x153e0ecf094ee4cd56d4267599f6b9648458ad798b49bc728a60556f30920a91",
            "version": "700541613",
            "previousVersion": "700541599",
            "digest": "Hfd8YLNr3ZVRVpN3E5SJN2TvxD8KnLLn5LqfDGB3GH2F"
        },
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "Shared": {
                    "initial_shared_version": 414947421
                }
            },
            "objectType": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::pool::Pool<0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS, 0x2::sui::SUI>",
            "objectId": "0x27c4fdb3b846aa3ae4a65ef5127a309aa3c1f466671471a806d8912a18b253e8",
            "version": "700541613",
            "previousVersion": "700541612",
            "digest": "9TbTffNAbhQPMCLgF9yZk5dpDEfQm7aXALdo6pQrwM2h"
        },
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "ObjectOwner": "0xa3085a57f827e5bf2f49eea097c4c02b62fd142fd3386e361c863b9b455d0574"
            },
            "objectType": "0x2::dynamic_field::Field<u64, 0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::big_vector::Slice<0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::order::Order>>",
            "objectId": "0x2b7499616c8e37b589d1feb9770f342dcbe25ba9dde1abffca22f2e08f20dd0e",
            "version": "700541613",
            "previousVersion": "700541612",
            "digest": "5zVPgUm2U3kFbKiYU9sHDVMYENctiNxz1C5GYw6vjnXZ"
        },
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "ObjectOwner": "0xda8154e9e54fd77dde91904419be34b647437d7f425e7d34f8d67c582da460df"
            },
            "objectType": "0x2::dynamic_field::Field<u64, 0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::pool::PoolInner<0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS, 0x2::sui::SUI>>",
            "objectId": "0x84f38798fdfceb3eb1c721bfdda57c76e3aaae4985ef202f21bde1d5d4a53c8f",
            "version": "700541613",
            "previousVersion": "700541612",
            "digest": "FJMjBRBHNbaT4Z7qtU6FupkPtVZL87tCr4BhAnhGKPbr"
        },
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "AddressOwner": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd"
            },
            "objectType": "0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::balance_manager::TradeCap",
            "objectId": "0x85e90d21add7091e681bcdabd530dccc14a700e6985cffd3ee1bb0b06ca25b12",
            "version": "700541613",
            "previousVersion": "700541591",
            "digest": "4Lv8bULUKwcyAJzab6rTMBLbYsdrHJCzCvKiokVt8R6Q"
        },
        {
            "type": "mutated",
            "sender": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd",
            "owner": {
                "ObjectOwner": "0x796ce8400fa0d89b7ed5eea790985ef0eb7963d64626c24212faee2fe0c69f3a"
            },
            "objectType": "0x2::dynamic_field::Field<0x2c8d603bc51326b8c13cef9dd07031a408a48dddb541963357661df5d3204809::balance_manager::BalanceKey<0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP>, 0x2::balance::Balance<0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP>>",
            "objectId": "0xc0f471030ea348748ab8e861cecbe87c4a977ec2dcd96fe68a8c91e67781f008",
            "version": "700541613",
            "previousVersion": "700541599",
            "digest": "DimmRooRrEtX24fxM3dzS8qG7HBmKc75dKG9JEjk49GR"
        }
    ],
    "balanceChanges": [
        {
            "owner": {
                "AddressOwner": "0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd"
            },
            "coinType": "0x2::sui::SUI",
            "amount": "-2575920"
        }
    ],
    "timestampMs": "1764264774627",
    "checkpoint": "216826319"
}