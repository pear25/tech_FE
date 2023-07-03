import { useRef, useState } from "react"
import * as API from "../api"
import { GrClose } from 'react-icons/gr';
import { useStoreState, useStoreActions } from "easy-peasy";
import AlertBox from "./AlertBox";
import axios from "axios";


const Form = () => {
    // Global state & dispatchers
    const status = useStoreState((state) => state.status)
    const mapData = useStoreState((state) => state.mapData)
    const dispatchMapData = useStoreActions((actions) => actions.setMapData)
    const dispatchStatus = useStoreActions((actions) => actions.setStatus)
    // Form refs
    const startingRef = useRef(null)
    const dropOffRef = useRef(null)
    // Button states
    const [showStartButton, setShowStartButton] = useState(false)
    const [showDropButton, setShowDropButton] = useState(false)
    // Get api fail message
    const [errorMessage, setErrorMessage] = useState(null)

    const handleInputChange = (ref, setShowButton) => {
        if (!!ref.current.value) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    };

    const handleSubmitForm = async (data) => {
        const getRouteFromToken = async (token) => {
            try {
                // const getResponse = API.getRoute(token)
                const getResponse = await axios.get(`http://localhost:8080/route/${token}`)
                // Recall API logic
                if (getResponse.data.status === "in progress") {
                    dispatchStatus("busy")
                    return getRouteFromToken(token)
                }
                // Stop API call
                if (getResponse.data.status === "failure") {
                    setErrorMessage(getResponse.data.error)
                    dispatchStatus("fail")
                    return
                }
                // Successful API call
                dispatchStatus("success")
                const { path, total_distance, total_time } = getResponse.data

                dispatchMapData({
                    path: path,
                    total_distance: total_distance,
                    total_time: total_time
                })
            }
            catch (err) {
                dispatchStatus('server error')
            }
        }
        // Post call to get token
        dispatchStatus("")
        let token
        try {
            // const res = API.routingRequest(data)
            const res = await axios.post('http://localhost:8080/route', data)
            dispatchStatus("calling")
            token = res.data.token
        }
        catch (err) {
            return dispatchStatus('server error')
        }
        getRouteFromToken(token)
    }

    const handleResetForm = () => {
        startingRef.current.value = ""
        dropOffRef.current.value = ""
        setShowStartButton(false)
        setShowDropButton(false)
    }

    return (
        <div className="">
            <div className="p-8 pb-4 md:pb-8 col-span-1">
                <div className="mb-4">
                    <div className="flex flex-row items-center">
                        <input
                            ref={startingRef}
                            onChange={() => handleInputChange(startingRef, setShowStartButton)}
                            className="shadow appearance-none border rounded md:w-full lg:w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                            type="text"
                            placeholder="Starting Location" />
                        {showStartButton && <GrClose
                            data-testid="starting-clear"
                            onClick={() => {
                                startingRef.current.value = ""
                                setShowStartButton(false)
                            }} />}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="flex flex-row items-center">
                        <input
                            ref={dropOffRef}
                            onChange={() => handleInputChange(dropOffRef, setShowDropButton)}
                            className="shadow appearance-none border rounded md:w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline mr-4"
                            type="text"
                            placeholder="Drop off point" />
                        {showDropButton && <GrClose
                            data-testid="dropoff-clear"
                            onClick={() => {
                                dropOffRef.current.value = ""
                                setShowDropButton(false)
                            }} />}
                    </div>
                </div>
                <div className="flex items-center justify-start">
                    <button
                        className="
                        disabled:bg-orange-400 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-8"
                        type="button"
                        disabled={
                            status === "calling" ||
                            status === "busy" ||
                            (!startingRef.current?.value || !dropOffRef.current?.value)}
                        onClick={() => handleSubmitForm({
                            origin: startingRef.current.value,
                            destination: dropOffRef.current.value
                        })}>
                        Submit
                    </button>
                    <button
                        className="disabled:bg-blue-300 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => handleResetForm()}
                        disabled={(!startingRef.current?.value && !dropOffRef.current?.value)}
                    >
                        Reset
                    </button>
                </div>
            </div>
            <div className="h-full">
                <AlertBox status={status} mapData={mapData} errorMessage={errorMessage} />
            </div>
        </div>

    )
}

export default Form