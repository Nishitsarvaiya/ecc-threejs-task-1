# Threejs Object Manipulation

A Threejs scene containing 3 Geometries : Cube, IcoSphere and Cylinder.

## Features

-   The three objects are interactive.
-   When you click on an object, the camera zooms into the clicked object and gives you controls to manipulate the parameters of the geometry.

## How to run the project

-   clone this repository
-   run `npm i` to install all the dependencies
-   run `npm run dev` to start a dev server
-   run `npm run build` followed by `npm run preview` to preview the production build

## Code Walkthrough

Project is mainly divided into classes.

-   `World` class is the main class that initialises the Threejs Essentials to create a basic scene.
-   `objects` folder contains classes that create a specific type of 3D Object. Each class initialises its respective GUI to control its parameters.
