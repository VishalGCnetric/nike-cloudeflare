import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineEdit } from 'react-icons/ai';
import Modal from './Modal'; // Your custom modal component
import { saveShippingAddress } from '../../redux/slices/checkoutSlice';

const DeliveryInformation = () => {
    const dispatch = useDispatch();
     
    // Get shipping address from Redux store
    const shippingAddressFromRedux = useSelector((state) => state.checkout.shippingAddress);

    // Get shipping address from local storage with error handling
    let shippingAddressFromLocalStorage = {};
    try {
        const storedData = localStorage.getItem('shippingAddress');
        shippingAddressFromLocalStorage = storedData ? JSON.parse(storedData) : {};
    } catch (error) {
        console.error('Error parsing localStorage data', error);
    }

    // Set form data with fallback to Redux and local storage
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        landmark: '',
        streetLine1: '',
        streetLine2: '',
        city: '',
        postalCode: '',
        state: '',
        countryCode: '',
        phoneNumber: ''
    });

    // Sync formData with Redux or local storage when component mounts
    useEffect(() => {
        if (shippingAddressFromRedux && Object.keys(shippingAddressFromRedux).length > 0) {
            setFormData(shippingAddressFromRedux);
        } else if (Object.keys(shippingAddressFromLocalStorage).length > 0) {
            setFormData(shippingAddressFromLocalStorage);
        }
    }, [ ]);

    const [isModalOpen, setModalOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch the updated form data to Redux and save it to localStorage
        dispatch(saveShippingAddress(formData));
        localStorage.setItem('shippingAddress', JSON.stringify(formData)); // Save to localStorage
        setModalOpen(false); // Close the modal after submitting
    };

    // Check if formData contains any data
    const isAddressAvailable = Object.values(formData).some((value) => value !== '');

    return (
        <div className="mt-6 border-t border-zinc-300 dark:border-zinc-600 pt-4">
            <h4 className="text-md font-bold text-zinc-800 dark:text-zinc-200">Delivery</h4>

            {isAddressAvailable ? (
                <div>
                    <div className="flex justify-between items-center">
                        <p className="text-zinc-800 dark:text-zinc-200">
                            {`${formData?.firstName} ${formData?.lastName}`}
                        </p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                        >
                            <AiOutlineEdit className="mr-1" /> Edit
                        </button>
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200">{formData?.landmark}</p>
                    <p className="text-zinc-800 dark:text-zinc-200">{`${formData?.streetLine1}, ${formData?.streetLine2}`}</p>
                    <p className="text-zinc-800 dark:text-zinc-200">{`${formData?.city}, ${formData?.state} ${formData?.postalCode}`}</p>
                    <p className="text-zinc-800 dark:text-zinc-200">{formData?.phoneNumber}</p>
                    <p className="text-zinc-800 dark:text-zinc-200">{formData?.countryCode}</p>
                </div>
            ) : (
                <div>
                    <p className="text-zinc-500 dark:text-zinc-400">No address added yet.</p>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Add Address
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800">
                        <h2 className="text-lg font-bold mb-4">Edit Delivery Information</h2>
                        {[
                            { label: 'First Name', name: 'firstName', value: formData.firstName },
                            { label: 'Last Name', name: 'lastName', value: formData.lastName },
                            { label: 'Landmark', name: 'landmark', value: formData.landmark },
                            { label: 'Street Line 1', name: 'streetLine1', value: formData.streetLine1 },
                            { label: 'Street Line 2', name: 'streetLine2', value: formData.streetLine2 },
                            { label: 'City', name: 'city', value: formData.city },
                            { label: 'Postal Code', name: 'postalCode', value: formData.postalCode },
                            { label: 'State', name: 'state', value: formData.state },
                            { label: 'Country Code', name: 'countryCode', value: formData.countryCode },
                            { label: 'Phone Number', name: 'phoneNumber', value: formData.phoneNumber }
                        ].map((input, index) => (
                            <div key={index} className="mb-4">
                                <label className="block text-sm text-zinc-800 dark:text-zinc-200">{input.label}</label>
                                <input
                                    type="text"
                                    name={input.name}
                                    value={input.value}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded"
                                />
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Save
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default DeliveryInformation;
