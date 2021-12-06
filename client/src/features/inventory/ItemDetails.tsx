import { observer } from "mobx-react-lite";
import { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, Header, Image } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";
import Photo from "../../models/photo";
import { useStore } from "../../stores/store";
import PhotoUploadWidget from "../photos/PhotoUploadWidget";

export default observer(function ItemDetails() {
    const {id} = useParams<{id: string}>();
    const { inventoryStore } = useStore();
    const { getDetails, currentItem, loadingInitial, loading, setMainPhoto, deletePhoto, uploadPhoto, uploading } = inventoryStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState("");

    useEffect(() => {
        getDetails(id);
    }, [getDetails, id]);

    function handleSetMainPhoto(e: SyntheticEvent<HTMLButtonElement>, photo: Photo) {
        setTarget(e.currentTarget.name)
        setMainPhoto(currentItem!.id, photo);
    }

    function handleDeletePhoto(e: SyntheticEvent<HTMLButtonElement>, photo: Photo) {
        setTarget(e.currentTarget.name);
        deletePhoto(currentItem!.id, photo);
    }

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file, currentItem!.id).then(() => setAddPhotoMode(false));
    }

    if (loadingInitial) return (<LoadingComponent content='Loading Item...' />);
    return (
        <Fragment>
            <Image src={currentItem?.mainPhoto || '/assets/drill.jpeg'} 
                floated='right' 
                size='medium' 
            />
            <Button as={Link} to='/dashboard' size='medium' content='Back to Items' color='grey' icon='arrow circle left'/>
            <Header as='h1' content={currentItem?.itemName}  />
            <p>{currentItem?.itemDescription}</p>
            
            <Header as='h2' content='Stock' />
            <p><strong>Total: </strong>{currentItem?.totalStock}</p>
            <p><strong>Available: </strong>{currentItem?.availableStock}</p>

            
                <Header as='h2' content='Photos' style={{display: 'inline-block'}} />
                <Button 
                    circular 
                    icon={addPhotoMode ? 'close' : 'add'}
                    content={addPhotoMode ? 'Cancel' : 'Add'}
                    onClick={() => setAddPhotoMode(!addPhotoMode)} 
                    style={{marginLeft: '1em'}}
                    size='tiny'
                />
            
            { 
                addPhotoMode ? <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} /> :
                !currentItem!.photos || currentItem!.photos.length === 0 ? 
                <p>No photos yet.</p> :
                <Card.Group itemsPerRow={4}>
                    {currentItem?.photos?.map((photo, index) => (
                       <Card key={index}>
                           <Image src={photo.url} />
                           <ButtonGroup widths='4'>
                                <Button 
                                    name={'main' + photo.id}
                                    onClick={e => handleSetMainPhoto(e, photo)}
                                    content='Set Main' 
                                    color='facebook' 
                                    disabled={photo.isMain}
                                    loading={loading && target=== 'main' + photo.id} />
                                <Button 
                                    icon='trash'
                                    name={'delete' + photo.id} 
                                    color='google plus' 
                                    onClick={e => handleDeletePhoto(e, photo)}
                                    loading={loading && target === 'delete' + photo.id}
                                />
                           </ButtonGroup>
                       </Card>
                    ))}
                </Card.Group>
            }
            

            <Header as='h2' content='Orders'  />
            <p>Orders go here</p>
        </Fragment>
    );
});