import React, {useState, useEffect, useContext, createContext} from 'react'
import {supabase} from '../database/Database'

const  authContext = createContext();

export const AuthProvider = ({children}) => {
    //Call our custom hook
    const auth = useProviderAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext)
}

function useProviderAuth() {
    // If we are logged in return the user object
    // Create useState for user 
    const [currUser, setCurrUser] = useState(null)

    // Then declare the login & logout function
    const Login = async (email) => {
        const {error, user} = await supabase.auth.signIn({email})

        if(error) {
            console.log(error)
        }

        return {error, user}

    }

    const LoginPass = async (email, password) => {
        const {error, user} = await supabase.auth.signInWithPassword({
            email: email, 
            password: password,
        })

        if(error) {
            console.log(error)
        }

        return {error, user}

    }

    const Logout = async () => {
        const {error} = await supabase.auth.signOut()

        if(error) {
            console.log(error)
        }

        setCurrUser(null)

    }

    useEffect(() => {
        // Everytime the page loads we check if we have a session
        const getUser = async(e) => {
            const { data: { user } } = await supabase.auth.getUser()
            setCurrUser(user)
        }

        getUser()

        

        // Look up the latest event to see if the user was signed in or signed out
        const auth = supabase.auth.onAuthStateChange((_event, session) => {
                if(_event === 'SIGNED_IN'){
                    setCurrUser(session.user)
                }

                if(_event === "SIGNED_OUT"){
                    setCurrUser(null)
                }

                return () => auth.unsubscribe()
        })


    }, [])

    return {
        currUser,
        Login,
        LoginPass,
        Logout
    }

}
