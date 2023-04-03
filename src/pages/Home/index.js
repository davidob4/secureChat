import './index.scss'
import Sidebar from '../../components/sidebar'
import ChatBox  from '../../components/ChatBox'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'

const Home = () => {    
    return(
        <div className='home'>
            <Sidebar />
            <ChatBox />
        </div>
    )
}

export default Home