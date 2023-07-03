import React from "react"

const AlertBox = ({ status, mapData }) => {
    return (
        <div className="px-4">
            {status === "fail" &&
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="fail">
                    <p className="font-bold">Request failed</p>
                    <p>An unexpected error occured</p>
                </div>
            }
            {status === "busy" &&
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="busy">
                    <p className="font-bold">Please wait..</p>
                    <p>Our servers are experiencing higher load.</p>
                </div>
            }
            {status === "server error" &&
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="error">
                    <p className="font-bold">Server error occured</p>
                    <p>Please try again in a moment.</p>
                </div>
            }
            {status === "success" &&
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="success">
                    <p>Total Distance: {mapData?.total_distance}</p>
                    <p>Total time: {mapData?.total_time}</p>
                </div>
            }
            {status === "calling" &&
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="calling">
                    <p>Please wait for API response..</p>
                </div>
            }
        </div>
    )
}
export default React.memo(AlertBox)