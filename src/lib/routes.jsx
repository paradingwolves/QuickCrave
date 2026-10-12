import { createBrowserRouter } from "react-router-dom";
import React from "react";

import Home from "../components/home/Home";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import AddRecipe from "../components/recipes/AddRecipe";
import ProtectedRoute from "../components/protected/ProtectedRoute";
import Explore from "../components/recipes/Explore";
import Recipe from "../components/recipes/Recipe";
import MyRecipes from "../components/recipes/MyRecipes"; 
import AboutUs from "../components/about/AboutUs";
import SavedRecipes from "../components/recipes/SavedRecipes";
import PageNotFound from "../components/404/PageNotFound";

// Route Path Constants
export const ROOT = "/";
export const HOME = "/home";
export const EXPLORE = "/explore";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const ADD_RECIPE = "/add-recipe";
export const MY_RECIPES = "/my-recipes";                        
export const SAVED_RECIPES = "/saved-recipes";                        
export const RECIPE_DETAIL = "/recipes/:recipeId";
export const ABOUT = "/about";


export const router = createBrowserRouter([
  {
    path: ROOT,
    element: <Home />,
  },
  {
    path: HOME,
    element: <Home />,
  },
  {
    path: ABOUT,
    element: <AboutUs />,
  },
  {
    path: EXPLORE,
    element: <Explore />,
  },
  {
    path: LOGIN,
    element: <Login />,
  },
  {
    path: REGISTER,
    element: <Register />,
  },
  {
    path: ADD_RECIPE,
    element: (
      <ProtectedRoute>
        <AddRecipe />
      </ProtectedRoute>
    ),
  },
  {
    path: MY_RECIPES,
    element: (
      <ProtectedRoute>
        <MyRecipes />
      </ProtectedRoute>
    ),
  },
  {
    path: SAVED_RECIPES,
    element: (
      <ProtectedRoute>
        <SavedRecipes />
      </ProtectedRoute>
    ),
  },
  {
    path: RECIPE_DETAIL,
    element: <Recipe />,
  },
  {
    path: "*",
    element: <PageNotFound />, // Fallback wildcard route
  },
]);

export default router;