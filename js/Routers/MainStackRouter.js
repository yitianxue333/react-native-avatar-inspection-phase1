import React, { Component } from "react";
import Login from "../components/login/";
import Home from "../components/home/";
import DetailPage from "../components/detailPage";
import PhotoPage from "../components/PhotoPage";
import CameraPage from "../components/cameraPage";
import TodayPage from "../components/todayPage";
import CustomDatePage from "../components/customeDatePage";
import HelpPage from "../components/HelpPage";
import HomeDrawerRouter from "./HomeDrawerRouter";
import { StackNavigator } from "react-navigation";
import { Header, Left, Button, Icon, Body, Title, Right } from "native-base";
HomeDrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null
});
export default (StackNav = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  DetailPage: { screen: DetailPage },
  PhotoPage: { screen: PhotoPage },
  CameraPage: { screen: CameraPage },
  TodayPage: { screen: TodayPage },
  CustomDatePage: { screen: CustomDatePage },
  HelpPage: { screen: HelpPage },
}, { headerMode: 'none' }));
