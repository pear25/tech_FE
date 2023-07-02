import { useEffect, useRef, useState } from "react"
import axios from "axios"
import * as API from "../api"
import { GrClose } from 'react-icons/gr';
import { useStoreState, useStoreActions } from "easy-peasy";
import AlertBox from "./AlertBox";


const Form = () => {
    // Global state & dispatchers
    const status = useStoreState((state) => state.status)
    const dispatchMapData = useStoreActions((actions) => actions.setMapData)
    const dispatchStatus = useStoreActions((actions) => actions.setStatus)
    // Form refs
    const startingRef = useRef(null)
    const dropOffRef = useRef(null)
    // Button states
    const [showStartButton, setShowStartButton] = useState(false)
    const [showDropButton, setShowDropButton] = useState(false)

    const handleInputChange = (ref, setShowButton) => {
        if (!!ref.current.value) {
            setShowButton(true);
            console.log('has value');
        } else {
            setShowButton(false);
            console.log('no value');
        }
    };

    const handleSubmitForm = async (data) => {
        const getRouteFromToken = async (token) => {
            try {
                const getResponse = await axios.get(`http://localhost:8080/route/${token}`)
                // Recall API logic
                if (getResponse.data.status === "in progress") {
                    dispatchStatus("busy")
                    return getRouteFromToken(token)
                }
                // Stop API call
                if (getResponse.data.status === "failure") {
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
            const res = await axios.post("http://localhost:8080/route", data)
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
    }

    return (
        <>
            <div className="p-8 pb-8 overflow-y-scroll">
                <div className="mb-4">
                    <div className="flex flex-row items-center">
                        <input
                            ref={startingRef}
                            onChange={() => handleInputChange(startingRef, setShowStartButton)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                            id="start"
                            type="text"
                            placeholder="Starting Location" />
                        {showStartButton && <GrClose
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
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline mr-4"
                            id="drop-off"
                            type="text"
                            placeholder="Drop off point" />
                        {showDropButton && <GrClose
                            onClick={() => {
                                dropOffRef.current.value = ""
                                setShowDropButton(false)
                            }} />}
                    </div>
                </div>
                <div className="flex items-center justify-start">
                    <button
                        className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-8"
                        type="button"
                        onClick={() => handleSubmitForm({
                            origin: startingRef.current.value,
                            destination: dropOffRef.current.value
                        })}>
                        Submit
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => handleResetForm()}
                    >
                        Reset
                    </button>

                </div>
            </div>
            <AlertBox status={status} />
        </>

    )
}

export default Form