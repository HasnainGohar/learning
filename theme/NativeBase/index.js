import { extendTheme } from "native-base"
import COLORS from "../COLORS"

const theme = extendTheme({

    fontConfig: {
        Poppins: {
            100: {
                normal: "Poppins-Thin",
                italic: "Poppins-ThinItalic",
            },
            200: {
                normal: "Poppins-ExtraLight",
                italic: "Poppins-ExtraLightItalic",
            },
            300: {
                normal: "Poppins-Light",
                italic: "Poppins-LightItalic",
            },
            400: {
                normal: "Poppins-Regular",
                italic: "Poppins-RegularItalic",
            },
            500: {
                normal: "Poppins-Medium",
                italic: "Poppins-MediumItalic",
            },
            600: {
                normal: "Poppins-SemiBold",
                italic: "Poppins-SemiBoldItalic",
            },
            700: {
                normal: 'Poppins-Bold',
                italic: 'Poppins-BoldItalic',
            },
            800: {
                normal: 'Poppins-ExtraBold',
                italic: 'Poppins-ExtraBoldItalic',
            },
            900: {
                normal: 'Poppins-Black',
                italic: 'Poppins-BlackItalic',
            },
        },
    },

    // Make sure values below matches any of the keys in `fontConfig`
    fonts: {
        heading: "Poppins",
        body: "Poppins",
        mono: "Poppins",
    },


    colors: {
        primary: {
            50: '#f2e7fd',
            100: '#e6cefa',
            200: '#d9b6f8',
            300: '#c085f3',
            400: '#a754ee',
            500: '#8e23e9',
            600: '#810be7',
            700: '#740ad0',
            800: '#6709b9',
            900: '#6709b9'
        },
        secondary: {
            50: '#eceffd',
            100: '#c7d0fa',
            200: '#a1b0f7',
            300: '#7b90f3',
            400: '#5671f0',
            500: '#4361ee',
            600: '#3c57d6',
            700: '#364ebe',
            800: '#364ebe',
            900: '#2f44a7',
        },
    },

    components: {
        Box: {
            variants: {
                container: {
                    flex: 1,
                    backgroundColor: COLORS.backgroundColor,
                },

                card: {
                    p: 3,
                    borderRadius: 15,
                    backgroundColor: '#FFF',
                    shadowColor: "#000000",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.17,
                    shadowRadius: 3.05,
                    elevation: 4
                },
            }
        },

        Card: {
            baseStyle: {
                backgroundColor: 'white',
                borderRadius: 15,
            }
        },

        Button: {
            baseStyle: {
                // height: 12,
                // minWidth: 125,
                borderRadius: 15,
                // shadowColor: "#000",
                // shadowOffset: {
                //     width: 0,
                //     height: 3,
                // },
                // shadowOpacity: 0.27,
                // shadowRadius: 4.65,

                // elevation: 6,
            }
        },

        IconButton: {
            baseStyle: {
                borderRadius: 10
            }
        },

        Input: {
            baseStyle: {
                // height: 10,
                borderRadius: 10
            },
            defaultProps: {
                fontSize: 16
            }
        },

        FormControlLabel: {
            baseStyle: {
                _text: {
                    fontSize: 14
                }
            }
        },

        Heading: {
            baseStyle: {
                color: 'primary.600',
                fontFamily: 'heading'
            }
        },

        ScrollView: {
            defaultProps: {
                indicatorStyle: {
                    padding: 10,
                    backgroundColor: '#fff'
                }
            }
        },

        Stack: {
            variants: {
                container: {
                    padding: 4,
                    defaultProps: {
                        space: 4
                    }
                }
            }
        },

        Menu: {
            baseStyle: {
                borderRadius: 15,
                py: 0,
            }
        },

        Toast: {
            baseStyle: {
                bg: 'secondary.500',
                rounded: 'xl',
                opacity: 0.85,

            },
        },

    }
})

export default theme