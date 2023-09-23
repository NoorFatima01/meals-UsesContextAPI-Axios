import React, {useState, useContext,useEffect} from 'react'
import axios from 'axios'

const AppContext = React.createContext()

const allMealsURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s='

const randomMealURL = 'https://www.themealdb.com/api/json/v1/1/random.php'


const getFavFromLocalStorage = () => {
    let favorites = localStorage.getItem('favorites');
    if(favorites){
        favorites = JSON.parse(localStorage.getItem('favorites'))
    }
    else{
        favorites=[]
    }
    return favorites
}

const AppProvider = ({children}) => {

    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState(null)
    const [favorites, setFavorites] = useState(getFavFromLocalStorage())

    const fetchMeals = async (url) => {
        setLoading(true)
        try{
            const {data} = await axios.get(url) 
            if(data.meals){
                setMeals(data.meals)
            }
            else{
                setMeals([])
            }
            
        } catch(error){
            console.log(error.response)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchMeals(allMealsURL)
      },[])

    useEffect(() => {
        if(!searchTerm) return
        fetchMeals(`${allMealsURL}${searchTerm}`)
    },[searchTerm])

    const fetchRandomMeal = () => {
        fetchMeals(randomMealURL)
    }

    const selectMeal = ({idMeal,favoriteMeal}) => {
        console.log(idMeal)
        let meal;
        if (favoriteMeal){
            meal = favorites.find((meal) => meal.idMeal === idMeal);
        }
        else {
            meal = meals.find((meal) => {
                return (meal.idMeal === idMeal);
            })
        }
        setSelectedMeal(meal)
        setShowModal(true)
    }

    const closeModal = () =>{
        setShowModal(false) 
    }

    const addToFav = (idMeal) => {
        const alreadyFav = favorites.find((meal) => meal.idMeal === idMeal);
        if (alreadyFav) return
        const meal = meals.find((meal) => meal.idMeal === idMeal);
        const updatedFavorites = [...favorites, meal]
        setFavorites(updatedFavorites)
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    }

    const removeFav = (idMeal) => {
        const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal);
        setFavorites(updatedFavorites)
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    }

    return(
        <AppContext.Provider value={{loading, meals, setSearchTerm,fetchRandomMeal,showModal, selectMeal, selectedMeal, closeModal, favorites, addToFav, removeFav}}>
            {children}
        </AppContext.Provider>
    )
} 

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppContext,AppProvider}