import React from "react";
import { Modal, Box } from "@mui/material";
import DetailProduct from "@/pages/product/detailProduct";
import ProductDetailbyUser from "@/pages/product/detailProduct-user";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductId: string | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  selectedProductId,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          width: "80%",
          height: "90%",
          padding: "2vw",
          borderRadius: "0.8vw",
        }}
      >
        {selectedProductId ? (
          <ProductDetailbyUser
            selectedProductId={selectedProductId}
            isOpen={isOpen}
            onClose={onClose}
          />
        ) : (
          <ProductDetailbyUser
            selectedProductId={""}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </Box>
    </Modal>
  );
};

export default ProductModal;
