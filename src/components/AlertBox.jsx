import { useStoreState } from "easy-peasy"

const AlertBox = ({ status }) => {

    const mapData = useStoreState((state) => state.mapData)
    console.log(mapData)
    return (
        <div className="px-4">
            {status === "fail" &&
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Request failed</p>
                    <p>An unexpected error occured</p>
                </div>
            }
            {status === "busy" &&
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                    <p className="font-bold">Please wait..</p>
                    <p>Our servers are experiencing higher load.</p>
                </div>
            }
            {status === "server error" &&
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Server error occured</p>
                    <p>Please try again in a moment.</p>
                </div>
            }
            {status === "success" &&
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    <p>Total Distance: {mapData.total_distance}</p>
                    <p>Total time: {mapData.total_time}</p>
                </div>
            }
            {status === "calling" &&
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                    <p>Please wait for API response..</p>
                </div>
            }
        </div>
    )
}
export default AlertBox