import React, { Component } from "react";
import Home from "../components/home/";
import { DrawerNavigator } from "react-navigation";
export default (DrawNav = DrawerNavigator(
  {
    Home: { screen: Home }
  }
));
