import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux-store/store";
import classec from "./main-header.module.css";
import { NextPage } from "next";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import DisplaySettingsOutlinedIcon from "@mui/icons-material/DisplaySettingsOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import { Collapse } from "@mui/material";

const drawerWidth = 280;

const menuAdminMaket = [
  {
    label: "ตรวจสอบการชำระเงิน",
    link: "/admin-market/orders/orders-check-payment",
    icon: <CheckBoxOutlinedIcon />,
    children: [],
  },
  {
    label: "คำสั่งซื้อรอดำเนินการ",
    link: "/admin-market/orders/orders-pending",
    icon: <ReceiptLongOutlinedIcon />,
    children: [],
  },
  {
    label: "คำสั่งซื้อสำเร็จ",
    link: "/admin-market/orders/orders-success",
    icon: <InventoryOutlinedIcon />,
    children: [],
  },
  {
    label: "คลังสินค้า",
    link: "",
    icon: <Inventory2OutlinedIcon />,
    children: [
      {
        label: "จัดการสินค้า",
        link: "/admin-market/warehouse/managmant-product",
        icon: <Inventory2OutlinedIcon />,
      },
      {
        label: "ตั้งค่าโชว์สินค้า",
        link: "/admin-market/warehouse/settign-show-product",
        icon: <DisplaySettingsOutlinedIcon />,
      },
    ],
  },
  {
    label: "Dashboard",
    link: "/admin-market/dashboard",
    icon: <BarChartOutlinedIcon />,
    children: [
      {
        label: "ยอดขายภาพรวม",
        link: "/admin-market/dashboard/sales-overall",
        icon: <QueryStatsOutlinedIcon />,
      },
      {
        label: "ยอดขายแบ่งตามหมวดหมู่",
        link: "/admin-market/dashboard/sales-category",
        icon: <QueryStatsOutlinedIcon />,
      },
      // {
      //   label: "ภาพรวมสินค้าที่ซื้อซ้ำ",
      //   link: "/admin-market/dashboard/repeat-purchase",
      //   icon: <QueryStatsOutlinedIcon />,
      // },
    ],
  },
  {
    label: "จัดการทีม",
    link: "/admin-market/manage-team",
    icon: <Groups2OutlinedIcon />,
    children: [],
  },
  {
    label: "คู่มือการใช้งาน",
    link: "/admin-market/instruction-manual",
    icon: <MenuBookOutlinedIcon />,
    children: [],
  },
];

const menuAdminSystem = [
  // { label: "demo", link: "/", icon: <InboxIcon /> },
  {
    label: "ข้อมูลส่วนบุคคล",
    link: "/admin-system/crud-user",
    icon: <InboxIcon />,
    children: [],
  },
  {
    label: "หมวดหมู่",
    link: "/admin-system/crud-category",
    icon: <InboxIcon />,
    children: [],
  },
  {
    label: "สินค้าทั้งหมด",
    link: "/admin-system/crud-product",
    icon: <InboxIcon />,
    children: [],
  },
  {
    label: "ประวัติการสั่งซื้อ",
    link: "/admin-system/crud-product-order",
    icon: <InboxIcon />,
    children: [],
  },
  {
    label: "ประเภทการจ่ายเงิน",
    link: "/admin-system/crud-payment-type",
    icon: <InboxIcon />,
    children: [],
  },
];

const MenuBar: NextPage = () => {
  const router = useRouter();
  const userRole = useSelector((state: RootState) => state.auth.userRole);

  const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(0);
  const [selectedChildrenMenuItem, setSelectedChildrenMenuItem] = useState<
    number | null
  >(null);

  const [openArray, setOpenArray] = useState([false, false]);

  const handleClickMenuBar = (
    link: string,
    index: number,
    childrenIndex: number = 0
  ) => {
    setSelectedMenuItem(index);
    setSelectedChildrenMenuItem(childrenIndex);
    router.push(link);
  };

  const handleClick = (index: number) => {
    let indexChildren = index === 3 ? 0 : 1;

    console.log(`indexChildren: ${indexChildren}`);

    setSelectedMenuItem(index);

    setOpenArray((prevOpenArray) => {
      const updatedArray = [...prevOpenArray];
      updatedArray[indexChildren] = !updatedArray[indexChildren];
      return updatedArray;
    });
    console.log(`setOpenArray: ${openArray}`);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#e2e2e2",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar
        sx={{
          marginY: "0.5rem",
          display: "flex",
        }}
      >
        <div className={classec.menuBarTitle}>
          <MenuIcon fontSize="medium" sx={{ marginRight: "0.5rem" }} />
          <h3>MENU</h3>
        </div>
      </Toolbar>
      <Divider />
      <List>
        {(userRole === 1 ? menuAdminSystem : menuAdminMaket).map(
          (item, index) => (
            <ListItem key={item.label} disablePadding>
              {item.children.length <= 0 ? (
                <ListItemButton
                  sx={{
                    backgroundColor:
                      selectedMenuItem === index ? "#cecece" : "#cac3c3",
                    marginY: "0.2rem",
                    borderRadius: "0.3rem",
                  }}
                  onClick={() => handleClickMenuBar(item.link, index)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ) : (
                <div style={{ width: "100%" }}>
                  <ListItemButton
                    sx={{
                      backgroundColor:
                        selectedMenuItem === index ? "#cecece" : "#cac3c3",
                      marginY: "0.2rem",
                      borderRadius: "0.3rem",
                    }}
                    onClick={() => handleClick(index)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openArray[index - 3] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse
                    in={openArray[index - 3]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.children.map((child, childrenIndex) => (
                        <ListItemButton
                          key={child.label}
                          sx={{
                            backgroundColor:
                              selectedChildrenMenuItem === childrenIndex
                                ? "#d3cfcf"
                                : "#afa3a3",
                            pl: 5,
                            marginY: "0.2rem",
                            borderRadius: "0.3rem",
                          }}
                          onClick={() =>
                            handleClickMenuBar(child.link, index, childrenIndex)
                          }
                        >
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </div>
              )}
            </ListItem>
          )
        )}
      </List>
    </Drawer>
  );
};

export default MenuBar;
