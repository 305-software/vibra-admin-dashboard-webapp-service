/**
 * CreateEvent Component
 *
 * This component is responsible for creating a new event, including details about the event itself
 * and any associated speakers. It integrates with Redux for state management and uses React-Bootstrap
 * for styling and layout.
 *
 * @component
 * @example
 * return (
 *   <CreateEvent />
 * )
 *
 * @imports
 * - `react-toastify/dist/ReactToastify.css`: CSS for toast notifications.
 * - React, { useEffect, useRef, useState }: React hooks for managing component state and lifecycle.
 * - Col, Container, Form, Row: Bootstrap components for layout.
 * - useDispatch, useSelector: Redux hooks for dispatching actions and selecting state.
 * - useNavigate: React Router hook for navigation.
 * - toast, ToastContainer: Components for displaying toast notifications.
 * - createEventDetails, eventCategoryDetails: Redux actions for event management.
 * - Button, Card, CustomInput, CustomTextArea, CustomTable: Custom components used in the form.
 *
 * @state
 * - formValues: Object containing the event details.
 * - speakers: Array of speaker objects.
 * - currentSpeaker: Object representing the currently edited speaker.
 * - error: Object for form validation errors.
 * - locationSuggestions: Array of suggested locations based on user input.
 * - inputValue: Current value of the location input.
 * - editingSpeakerIndex: Index of the speaker being edited.
 * - imagePreview: URL for the preview of the speaker's image.
 * - eventImagePreviews: Array of URLs for previews of up to 5 event images.
 * - loading: Boolean indicating whether the form submission is in progress.
 *
 * @methods
 * - handleChange: Updates form values based on user input.
 * - handleSpeakerChange: Updates the current speaker's details.
 * - handleEditSpeaker: Prepares the form for editing an existing speaker.
 * - addSpeaker: Adds a new speaker to the list.
 * - handleSubmit: Validates and submits the form data to create an event.
 * - validate: Checks for required fields and sets error messages.
 * - removeSpeaker: Removes a speaker from the list.
 * - handleLocationChange: Fetches location suggestions based on user input.
 * - handleLocationSelect: Updates form values with the selected location.
 * - updateSpeaker: Updates an existing speaker's details or adds a new one.
 * - removeEventImage: Removes the event image and preview.
 * - removeSpeakerImage: Removes the speaker image and preview.
 *
 * @returns {JSX.Element} The rendered CreateEvent component.
 */




import 'react-toastify/dist/ReactToastify.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import config from "../../config"
import { UserContext } from '../context/userContext';
import { createEventDetails, eventCategoryDetails } from "../../redux/eventSlice";
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import HeadCard from "../card/HeaderCard"
import Card from '../card/tableCard';
import CustomInput from '../customInput/customInput';
import CustomTextArea from '../customInput/customTextArea';
import CustomTable from '../table/speakerEventTable';

const CreateEvent = () => {
    const initialFormValues = {
        eventId: '',
        eventName: '',
        eventDescription: '',
        location: '',
        eventTime: '',
        eventDate: '',
        price: '',
        lat: '',
        long: '',
        eventType: '',
        totalSeats: '',
        eventGuideline: '',
        imageUrls: [],
    };
    const [formValues, setFormValues] = useState(initialFormValues);
    const [error, setError] = useState({});
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useContext(UserContext);
    const categories = useSelector((state) => state.eventSlice.eventCategory) || [];
    const eventImageInputRef = useRef(null);
    const [eventImagePreviews, setEventImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showBoostModal, setShowBoostModal] = useState(false);
    const { t } = useTranslation();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        let processedValue = value;
        
        // Apply time formatting only for eventTime field
        if (name === 'eventTime' && value) {
          processedValue = value.substring(0, 5); // Remove seconds
        }

        // Handle event image upload - support up to 5 images
        if (name === 'imageUrls' && type === 'file' && files.length > 0) {
            const currentImages = formValues.imageUrls;
            
            // Check if adding new files would exceed the limit
            if (currentImages.length >= 5) {
                toast.error(t("MAXIMUM_5_IMAGES_ALLOWED") || "You can only upload a maximum of 5 images", {
                    display: 'flex',
                    toastId: 'max-images-error',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    toastClassName: 'custom-toast',
                    bodyClassName: 'custom-toast',
                });
                // Reset the file input
                if (eventImageInputRef.current) {
                    eventImageInputRef.current.value = '';
                }
                return;
            }
            
            // Process each selected file
            const newImages = [];
            const newPreviews = [...eventImagePreviews];
            let filesAdded = 0;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Validate file type - only allow images
                if (!file.type.startsWith('image/')) {
                    toast.error(t("PLEASE_SELECT_AN_IMAGE_FILE"), {
                        display: 'flex',
                        toastId: 'file-type-error',
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        toastClassName: 'custom-toast',
                        bodyClassName: 'custom-toast',
                    });
                    continue;
                }
                
                // Check limit while adding files
                if (currentImages.length + filesAdded >= 5) {
                    toast.warning(t("MAXIMUM_5_IMAGES_ALLOWED") || "Only 5 images can be uploaded. Additional files were skipped.", {
                        display: 'flex',
                        toastId: 'max-images-warning',
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        toastClassName: 'custom-toast',
                        bodyClassName: 'custom-toast',
                    });
                    break;
                }
                
                newImages.push(file);
                newPreviews.push(URL.createObjectURL(file));
                filesAdded++;
            }
            
            setFormValues({
                ...formValues,
                imageUrls: [...currentImages, ...newImages]
            });
            setEventImagePreviews(newPreviews);
            
            // Reset the file input
            if (eventImageInputRef.current) {
                eventImageInputRef.current.value = '';
            }
        } else {
            setFormValues({
                ...formValues,
                [name]: type === 'file' ? files[0] : processedValue
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            const formData = new FormData();
            Object.keys(formValues).forEach(key => {
                if (key === 'imageUrls') {
                    // Append each image separately
                    formValues[key].forEach((image, index) => {
                        formData.append(`imageUrls[${index}]`, image);
                    });
                } else {
                    formData.append(key, formValues[key]);
                }
            });
            // Add user ID to formData
            if (user?.data.user?._id) {
                formData.append('userId', user.data.user._id);
            }
            try {
                const response = await dispatch(createEventDetails(formData)).unwrap();
             
                if (response && response.status === 200) {
                    toast.success(t("EVENT_CREATED_SUCCESSFULLY"), {
                        display: 'flex',
                        toastId: 'user-action',
                        autoClose: 2000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        toastClassName: 'custom-toast',
                        bodyClassName: 'custom-toast',
                    });
                    // Show boost modal after successful event creation
                    setTimeout(() => {
                        setShowBoostModal(true);
                    }, 2000);
                }
            } catch (err) {
                toast.error(err.message, {
                    display: 'flex',
                    toastId: 'error-action',
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    toastClassName: 'custom-toast',
                    bodyClassName: 'custom-toast',
                });
            } finally {
                setLoading(false); // End loading
            }
        }
    };

    useEffect(() => {
        dispatch(eventCategoryDetails());
    }, [dispatch]);

    // Function to remove event image by index
    const removeEventImage = (index) => {
        const updatedImages = formValues.imageUrls.filter((_, i) => i !== index);
        const updatedPreviews = eventImagePreviews.filter((_, i) => i !== index);
        
        setFormValues({
            ...formValues,
            imageUrls: updatedImages
        });
        setEventImagePreviews(updatedPreviews);
        
        // Reset file input
        if (eventImageInputRef.current) {
            eventImageInputRef.current.value = '';
        }
    };

    const validate = () => {
        const error = {};
        let isFormValid = true;

        if (!formValues.eventId || formValues.eventId.trim() === "") {
            isFormValid = false;
            error.eventId = t("PLEASE_ENTER_THE_EVENT_CATEGORY");
        }
        if (!formValues.eventName || formValues.eventName.trim() === "") {
            isFormValid = false;
            error.eventName = t("PLEASE_ENTER_THE_EVENT_NAME");
        }
        if (!formValues.eventDescription || formValues.eventDescription.trim() === "") {
            isFormValid = false;
            error.eventDescription = t("PLEASE_ENTER_THE_EVENT_SUBSCRIPTION");
        }
        if (!formValues.location || formValues.location.trim() === "") {
            isFormValid = false;
            error.location = t("PLEASE_ENTER_THE_CONSTANT");
        }
        if (!formValues.eventDate || formValues.eventDate.trim() === "") {
            isFormValid = false;
            error.eventDate = t("PLEASE_ENTER_THE_EVENTDATE");
        }
        if (!formValues.eventTime || formValues.eventTime.trim() === "") {
            isFormValid = false;
            error.eventTime = t("PLEASE_ENTER_THE_EVENTTIME");
        }
        if (!formValues.price || formValues.price.trim() === "") {
            isFormValid = false;
            error.price = t("PLEASE_ENTER_THE_EVENTPRICE");
        }
        if (!formValues.eventType || formValues.eventType.trim() === "") {
            isFormValid = false;
            error.eventType = t("PLEASE_ENTER_THE_EVENTTYPE");
        }
        if (!formValues.totalSeats || formValues.totalSeats.trim() === "") {
            isFormValid = false;
            error.totalSeats = t("PLEASE_ENTER_THE_TOTALSEATS");
        }
        if (!formValues.eventGuideline || formValues.eventGuideline.trim() === "") {
            isFormValid = false;
            error.eventGuideline = t("PLEASE_ENTER_THE_EVENT_GUIDELINES");
        }
        if (!formValues.imageUrls || formValues.imageUrls.length === 0) {
            isFormValid = false;
            error.imageUrls = t("PLEASE_CHOOSE_THE_IMAGE");
        }

        setError(error);
        return isFormValid;
    };

    const handleLocationChange = async (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim()) {
            try {
                const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY;
                const response = await fetch(
                    `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(value)}&format=json`
                );

                if (!response.ok) {
                    throw new Error(t("FAIL_TO_FETCH_THE_LOCATION"));
                }

                const data = await response.json();
                setLocationSuggestions(data);
            } catch (error) {
                console.error("Error fetching location suggestions:", error.message);
            }
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleLocationSelect = (place) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            location: place.display_name,
            lat: place.lat,
            long: place.lon,
        }));
        setInputValue(place.display_name);
        setLocationSuggestions([]);
    };

    const handleBoostEvent = () => {
        setShowBoostModal(false);
        // Navigate to boost event page or open boost flow
        // You can add the boost logic here
        toast.info(t("REDIRECTING_TO_BOOST") || "Redirecting to boost event...", {
            display: 'flex',
            autoClose: 1500,
            closeOnClick: true,
            pauseOnHover: true,
            toastClassName: 'custom-toast',
            bodyClassName: 'custom-toast',
        });
        setTimeout(() => {
            navigate('/eventList'); // Or navigate to boost page
        }, 1500);
    };

    const handleSkipBoost = () => {
        setShowBoostModal(false);
        navigate('/eventList');
    };

    return (
        <Container fluid>

            <div>
                <div className="mb-4">
                    <HeadCard>
                        <div className='Header-div'>
                            <h3>{t("CREATE_EVENT")}</h3>

                            <div className='event-button'>
                                <Button loading={loading} onClick={handleSubmit} style={{ backgroundColor: " #56D436", color: "#fff", padding: "10px 18px", width: "238px" }} name={t("SAVE")} />
                            </div>
                        </div>

                    </HeadCard>
                </div>

                <Form className='create-event' onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6} md={12} className='mb-4'>
                            <Card>
                                <div className='booking-main-head'>
                                    <h3 className='mb-4'>{t("EVENT_DETAILS")}</h3>

                                    <Form.Group controlId="eventId" className="mb-3">
                                        <CustomInput
                                            type="dropdown"
                                            label={t("EVENT_CATEGORY")}
                                            options={categories}
                                            value={formValues.eventId}
                                            onChange={handleChange}
                                            name="eventId"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventId}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventName" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={t("EVENT_NAME")}
                                            value={formValues.eventName}
                                            onChange={handleChange}
                                            name="eventName"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventName}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventDescription" className="mb-3">
                                        <CustomTextArea
                                            label={t("EVENT_DESCRIPTION")}
                                            type="textarea"
                                            value={formValues.eventDescription}
                                            onChange={handleChange}
                                            name="eventDescription"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventDescription}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventDate" className="mb-3">
                                        <CustomInput
                                            type="date"
                                            label={t("EVENT_DATE")}
                                            value={formValues.eventDate}
                                            onChange={handleChange}
                                            name="eventDate"
                                            min={new Date().toISOString().split('T')[0]


                                            }

                                        />
                                        <p style={{ color: 'red' }}>{error.eventDate}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventTime" className="mb-3">
                                        <CustomInput
                                            type="time"
                                            step={1}
                                            label={t("EVENT_TIME")} 
                                            value={formValues.eventTime}
                                            onChange={handleChange}
                                            name="eventTime"
                                             format="HH:mm"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventTime}</p>
                                    </Form.Group>

                                    <Form.Group controlId="price" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={`${t("EVENT_PRICE")} $`}
                                            value={formValues.price}
                                            onChange={handleChange}
                                            name="price"
                                        />
                                        <p style={{ color: 'red' }}>{error.price}</p>
                                    </Form.Group>                                   
                                </div>
                            </Card>
                        </Col>
                        
                        <Col lg={6} md={12} className='mb-4'>
                            <Card>
                                

                                    <Form.Group controlId="location" className="mb-3">
                                        <Form.Label className='form-event'>{t("LOCATION")} <span className='span-star'>*</span></Form.Label>


                                        <CustomInput
                                            type="text"
                                            className='form-event-control form-control'
                                            name="location"
                                            value={inputValue}
                                            onChange={handleLocationChange}
                                        />
                                        {locationSuggestions.length > 0 && (
                                            <ul className="suggestions-list">
                                                {locationSuggestions.map((place) => (
                                                    <div className='dropdown-location'>
                                                        <li key={place.place_id} onClick={() => handleLocationSelect(place)}>
                                                            {place.display_name}
                                                        </li>
                                                    </div>

                                                ))}
                                            </ul>
                                        )}
                                        <p style={{ color: 'red' }}>{error.location}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventType" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={t("EVENT_TYPE")}
                                            value={formValues.eventType}
                                            onChange={handleChange}
                                            name="eventType"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventType}</p>
                                    </Form.Group>

                                    <Form.Group controlId="totalSeats" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={t("TOTAL_TYPES")}
                                            value={formValues.totalSeats}
                                            onChange={handleChange}
                                            name="totalSeats"
                                        />
                                        <p style={{ color: 'red' }}>{error.totalSeats}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventGuidelines" className="mb-3">
                                        <CustomTextArea
                                            label={t("EVENT_GUIDELINES")}
                                            value={formValues.eventGuideline}
                                            onChange={handleChange}
                                            name="eventGuideline"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventGuideline}</p>
                                    </Form.Group> 

                                <Form.Group controlId="eventImages" className="mb-3">
                                        <input
                                            ref={eventImageInputRef}
                                            type="file"
                                            onChange={handleChange}
                                            name="imageUrls"
                                            accept="image/*"
                                            multiple
                                            style={{ display: 'none' }}
                                            id="imageUploadInput"
                                        />
                                        <label 
                                            htmlFor="imageUploadInput"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '60px 20px',
                                                border: '2px dashed #d9d9d9',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                backgroundColor: '#fafafa',
                                                transition: 'all 0.3s ease',
                                                minHeight: '200px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#4096ff';
                                                e.currentTarget.style.backgroundColor = '#f0f5ff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#d9d9d9';
                                                e.currentTarget.style.backgroundColor = '#fafafa';
                                            }}
                                        >
                                            <svg 
                                                width="64" 
                                                height="64" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="#4096ff" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                                style={{ marginBottom: '16px' }}
                                            >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                <line x1="12" y1="3" x2="12" y2="15"></line>
                                            </svg>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#4096ff',
                                                marginBottom: '8px'
                                            }}>
                                                {t("UPLOAD_PHOTOS_AND_VIDEO") || "Upload photos and video"}
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#8c8c8c'
                                            }}>
                                                {formValues.imageUrls.length}/5 images uploaded
                                            </div>
                                        </label>
                                        {error.imageUrls && (
                                            <p style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>{error.imageUrls}</p>
                                        )}
                                        
                                        {/* Event Image Previews with Delete Buttons */}
                                        {eventImagePreviews.length > 0 && (
                                            <div className="mt-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                                {eventImagePreviews.map((preview, index) => (
                                                    <div key={index} className="image-preview-container" style={{ position: 'relative', display: 'inline-block' }}>
                                                        <img
                                                            src={preview}
                                                            alt={`Event Preview ${index + 1}`}
                                                            style={{
                                                                maxWidth: '150px',
                                                                maxHeight: '150px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                border: '1px solid #ddd'
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEventImage(index)}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '5px',
                                                                right: '5px',
                                                                background: 'rgba(255, 0, 0, 0.7)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '50%',
                                                                width: '24px',
                                                                height: '24px',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold'
                                                            }}
                                                            title="Remove Image"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Form.Group>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </div>

            {/* Boost Event Modal */}
            {showBoostModal && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={handleSkipBoost}
                >
                    <div 
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '40px',
                            maxWidth: '500px',
                            width: '90%',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <svg 
                                width="80" 
                                height="80" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#56D436" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                style={{ margin: '0 auto' }}
                            >
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                        </div>
                        <h2 style={{ 
                            fontSize: '24px', 
                            fontWeight: '600', 
                            marginBottom: '16px',
                            color: '#333'
                        }}>
                            {t("BOOST_YOUR_EVENT") || "Boost Your Event?"}
                        </h2>
                        <p style={{ 
                            fontSize: '16px', 
                            color: '#666', 
                            marginBottom: '32px',
                            lineHeight: '1.5'
                        }}>
                            {t("BOOST_EVENT_DESCRIPTION") || "Increase your event's visibility and reach more attendees by boosting it now!"}
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            gap: '16px', 
                            justifyContent: 'center' 
                        }}>
                            <button
                                onClick={handleSkipBoost}
                                style={{
                                    padding: '12px 32px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    border: '2px solid #d9d9d9',
                                    backgroundColor: '#fff',
                                    color: '#666',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#999';
                                    e.currentTarget.style.color = '#333';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                    e.currentTarget.style.color = '#666';
                                }}
                            >
                                {t("SKIP") || "Skip"}
                            </button>
                            <button
                                onClick={handleBoostEvent}
                                style={{
                                    padding: '12px 32px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    border: 'none',
                                    backgroundColor: '#56D436',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#4AC030';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#56D436';
                                }}
                            >
                                {t("BOOST_NOW") || "Boost Now"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default CreateEvent;