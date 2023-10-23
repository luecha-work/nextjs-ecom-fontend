import React, {
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  RefObject,
} from "react";
import { Button, Container, Grid } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { NextPage } from "next";
import { AddingProductModel } from "@/common/models/product-result.interface";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

interface AddingProductImageProps {
  addingProductForm: AddingProductModel;
  selectedImages: File[];
  imageList: FormData[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  setImageList: React.Dispatch<React.SetStateAction<FormData[]>>;
  setAddingProductForm: React.Dispatch<
    React.SetStateAction<AddingProductModel>
  >;
  setIndexImageChange: React.Dispatch<
    React.SetStateAction<number[] | undefined>
  >;
}

const AddingProductImage: NextPage<AddingProductImageProps> = ({
  selectedImages,
  setSelectedImages,
  imageList,
  setImageList,
  addingProductForm,
  setIndexImageChange,
  setAddingProductForm,
}) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputCount, setInputCount] = useState(9);

  const { id } = router.query;

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    console.log(`handleImageChange`);

    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`file: ${file}`);
      const imagesArray = [file];
      setSelectedImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index] = imagesArray[0];
        return updatedImages;
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setSelectedImage(dataUrl);

        // if can select profile
        const formData = new FormData();
        formData.append("image", file);

        setImageList((prevImageList) => [...prevImageList, formData]);

        if (id !== undefined) {
          setIndexImageChange((prevIndexImages) => {
            const updatedIndexImages = [...(prevIndexImages || [])]; // Ensure it's not undefined
            updatedIndexImages[updatedIndexImages.length] = index;
            return updatedIndexImages;
          });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (index: number) => {
    if (id === undefined) {
      if (
        index >= 0 &&
        index < imageList.length &&
        index < selectedImages.length
      ) {
        // Remove data at the specified index using splice
        const newImageList = [...imageList];
        const newSelectedImages = [...selectedImages];

        newImageList.splice(index, 1);
        newSelectedImages.splice(index, 1);

        // อัปเดต state ด้วยรายการใหม่ที่ไม่มี index ที่ถูกลบ
        setImageList(newImageList);
        setSelectedImages(newSelectedImages);
      }
    } else {
      let newPathPicture = addingProductForm.pathPicture;

      if (index >= 0 && index < newPathPicture.length) {
        newPathPicture.splice(index, 1);

        setAddingProductForm({
          ...addingProductForm,
          pathPicture: newPathPicture,
        });
      }
    }
  };

  const handleAddInput = () => {
    if (selectedImages.length >= inputCount) {
      setInputCount((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {}, [selectedImages]);

  return (
    <Container>
      <Grid container spacing={2}>
        {Array.from({ length: inputCount }).map((_, index) => (
          <Grid item key={index} xs={4} mb={4}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => handleImageChange(event, index)}
              style={{ display: "none" }}
              id={`imageInput-${index}`}
              key={
                selectedImages[index] ? "fileInputVisible" : "fileInputHidden"
              } // ใช้ key เพื่อล้างค่า valu
            />
            <label htmlFor={`imageInput-${index}`}>
              <Button
                variant="contained"
                component="span"
                style={{
                  width: "100%",
                  height: "100%",
                  padding: 0,
                  background: "#e0e0e0",
                }}
              >
                {selectedImages[index] ? (
                  <img
                    src={URL.createObjectURL(selectedImages[index])}
                    alt={`Image ${index}`}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : addingProductForm.pathPicture?.length > 0 &&
                  addingProductForm.pathPicture[index] !== undefined ? (
                  <img
                    src={addingProductForm.pathPicture[index].url}
                    alt={`Image ${index}`}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  <>
                    <AddOutlinedIcon
                      sx={{
                        fontSize: "5rem",
                        margin: "auto",
                      }}
                    />
                  </>
                )}
              </Button>
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "0.2rem",
                // marginBottom: "0.5rem",
              }}
            >
              <IconButton
                component="span"
                id={`removeImage-${index}`}
                aria-label="delete"
                size="small"
                color="error"
                onClick={() => handleDeleteImage(index)}
              >
                <DeleteIcon color="error" fontSize="medium" />
              </IconButton>
            </div>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={0} justifyContent="center" mt={4}>
        <Button
          variant="contained"
          onClick={handleAddInput}
          style={{ width: "55%", backgroundColor: "#17a2b8" }}
        >
          Add Input
        </Button>
      </Grid>
    </Container>
  );
};

export default AddingProductImage;
