import Form from './components/Form'
import Map from './components/Map'


function App() {
  return (
    <div className='grid grid-flow-row grid-cols-none grid-rows-6 md:grid-rows-none md:grid-flow-col md:grid-cols-3 lg:grid-cols-4 gap-4 h-screen overflow-y-scroll'>
      <div className='row-span-2 md:col-span-1 overflow-y-scroll'>
        <Form />
      </div>
      <div className='row-span-4 md:col-span-2 lg:col-span-3'>
        <Map />
      </div>
    </div>
  )
}

export default App
