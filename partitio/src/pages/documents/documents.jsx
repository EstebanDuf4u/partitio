import { useEffect, useState } from "react";
import LeftPanel from "../../components/leftPanel/leftPanel";
import { useNavigate } from "react-router-dom";

import FETCH_BASE_URL from '../../fetch_url';

function Documents() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(FETCH_BASE_URL + '/api/me', {
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) throw new Error()
                return response.json()
            })
            .then(({ user }) => {
                setUser(user)
            })
            .catch(() => navigate('/login', {
                replace: true,
                state: { from: location.pathname }
            }))
    }, [navigate])

    if (!user) return null

    return (
        <>
            <LeftPanel user={user} />
            <h1>PAGE Documents</h1>
        </>
    )
}

export default Documents;