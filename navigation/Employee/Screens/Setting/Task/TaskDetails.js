import React, { useContext, useEffect, useState } from 'react'
import { PermissionsAndroid, StyleSheet } from 'react-native';
// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, View, Button, IconButton, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon, Modal, Menu, ScrollView, Image } from 'native-base'


// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import BackHeader from '../../../../../components/BackHeader'

// Redux 
import { connect } from 'react-redux'
import { taskDetails } from '../../../../../redux/actions/employeeActions'

// Documents
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';


const TaskDetails = (props) => {

    const { details, getTaskDetails, route } = props

    const { data } = route.params
    const toast = useToast()


    const [loading, setLoading] = useState(false)
    const [document, setDocument] = useState(null)
    const [textFileContent, setTextFileContent] = useState('');


    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            await getTaskDetails(data.taskId)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }



    const handleDocument = async (item) => {
        try {
            if (item.extension === '.txt') {
                const attachmentUri = `https://ausztechattendance-bucket.s3.amazonaws.com/${item.uri}`;
                await displayTxtFileContent(attachmentUri);
            } else {
                const attachmentUri = `https://ausztechattendance-bucket.s3.amazonaws.com/${item.uri}`;
                console.log(attachmentUri)

                const downloadDest = `${RNFS.DownloadDirectoryPath}/${item.name}${item.extension}`;
                const file = {
                    fromUrl: attachmentUri,
                    toFile: downloadDest,
                }
                const downloadResult = await RNFS.downloadFile(file);
                toast.show({
                    description: `Your Document is Download in ${downloadDest}`
                })
            }
        } catch (err) {
            console.log(err);
        }
    }



    const displayTxtFileContent = async (uri) => {
        try {
            const response = await fetch(uri);
            const text = await response.text();
            setTextFileContent(text);
            setDocument({ extension: '.txt', uri });
        } catch (error) {
            console.error('Error fetching txt file:', error);
            setTextFileContent('');
        }
    };


    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading}>
                <Stack space={4}>
                    <BackHeader >
                        {details?.name}
                    </BackHeader>
                    <Text mx={4}>
                        {details?.description}
                    </Text>
                    <Heading >
                        Documents
                    </Heading>
                    {
                        details?.documents?.map((item, index) => (
                            <HStack key={index} mx={4} alignItems={'center'} justifyContent={'space-between'} >
                                <HStack space={3} alignItems={'center'}>
                                    <Text>{index + 1}: </Text>
                                    <Text my={2}>{item.name.substring(0, 20 - 3)}{item.extension}</Text>
                                </HStack>
                                <HStack>
                                    <IconButton
                                        icon={<Icon as={AntDesign} name={'eye'} />}
                                        onPress={() => setDocument(item)}
                                    />
                                    <IconButton
                                        icon={<Icon as={AntDesign} name={'download'} />}
                                        onPress={() => handleDocument(item)}
                                    />
                                </HStack>
                            </HStack>
                        ))
                    }
                </Stack>

            </LoadingIndicator>
            <Modal
                isOpen={Boolean(document)}
                style={{
                    display: null,
                    alignItems: 'stretch',
                    justifyContent: 'space-between'
                }}
                _backdrop={{
                    opacity: 1,
                    backgroundColor: '#fff'
                }} >

                <View style={styles.container}>
                    <HStack position={'absolute'} alignItems={'center'} justifyContent={'flex-end'} top={16} right={6} zIndex={999} >
                        <IconButton
                            size={'sm'}
                            icon={<Icon as={AntDesign} name={'close'} size={'md'} />}
                            onPress={() => setDocument(null)}
                        />
                    </HStack>
                    {document?.extension === '.pdf' ? (
                        <Pdf
                            style={styles.pdf}
                            trustAllCerts={false}
                            enablePaging={true}
                            horizontal={true}
                            source={{ uri: `https://ausztechattendance-bucket.s3.amazonaws.com/${document?.uri}` }}
                            // onLoadComplete={(numberOfPages, filePath) => {
                            //     // console.log(`Number of pages: ${numberOfPages}`);
                            // }}
                            // onPageChanged={(page, numberOfPages) => {
                            //     // console.log(`Current page: ${page}`);
                            // }}
                            onError={(error) => {
                                console.log(error);
                            }}
                        // onPressLink={(uri) => {
                        //     // console.log(`Link pressed: ${uri}`);
                        // }} 
                        />
                    ) : document?.extension === '.txt' ? (
                        <ScrollView style={{ flex: 1 }}>
                            <Text style={{ padding: 10 }}>{textFileContent}</Text>
                        </ScrollView>
                    ) : (
                        <Image source={{ uri: `https://ausztechattendance-bucket.s3.amazonaws.com/${document?.uri}` }} style={styles.image} alt='image' />

                    )}
                </View>
            </Modal>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        details: state.employee.tasks.details,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTaskDetails: (data) => dispatch(taskDetails(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'relative'
    },
    pdf: {
        flex: 1,
        width: '100%',
    },
    image: {
        flex: 1,
        width: '100%',
        resizeMode: 'contain',
    },
});