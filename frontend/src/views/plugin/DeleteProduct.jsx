import Swal from 'sweetalert2'
import apiInstance from '../../utils/axios';

// Define a function named deleteProduct that takes vendorId and productPid as parameters
export const deleteProduct = async (vendorId, productPid) => {
    // Return a new Promise that handles asynchronous resolution or rejection
    return new Promise(async (resolve, reject) => {
        try {
            // Display a warning confirmation dialog using SweetAlert
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Xóa sản phẩm?',
                text: 'Bạn có chắc chắn muốn xóa sản phẩm này vĩnh viễn không?',
                confirmButtonText: 'Có, xóa nó!',
                showCancelButton: true,
            });

            // Check if the user confirmed the deletion
            if (result.isConfirmed) {
                // Make an asynchronous request to delete the product using apiInstance
                await apiInstance.delete(`vendor-product-delete/${vendorId}/${productPid}/`);
                // Display a success notification using SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Đã Xóa Sản Phẩm!',
                    text: 'Sản phẩm này đã được xóa vĩnh viễn.',
                });
                // Resolve the promise if deletion is successful
                // In the context of a Promise, resolving means that the asynchronous operation or task has completed successfully.
                resolve();
            } else if (result.isDenied) {
                // Display an error notification using SweetAlert if the user denies the deletion
                Swal.fire({
                    icon: 'error',
                    title: 'Đã Xảy Ra Lỗi',
                    text: 'Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại sau.',
                });
                // Reject the promise with an error if deletion is canceled or fails
                reject(new Error('Deletion canceled or failed.'));
            }
        } catch (error) {
            // Log the error to the console if an exception occurs during deletion
            console.error('Error deleting product:', error);
            // Reject the promise with the error object
            reject(error);
        }
    });
};

