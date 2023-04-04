import './index.scss'
import Sidebar from '../../components/sidebar'
import ChatBox  from '../../components/ChatBox'

const Home = () => {    
    return(
        <div className='home'>
            <Sidebar />
            <ChatBox />
        </div>
    )
}

export default Home