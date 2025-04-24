import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import AddressMap from "../../components/map/AddressMap";
import { FaTrashAlt } from "react-icons/fa";
import userAPI from "services/userService";
import ShopAPI from "services/shopService";

function MapConfirmModal({ address, onConfirm, onCancel }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h3>Xác nhận địa chỉ</h3>
                </div>
                <div className={styles.modalBody}>
                    <p>Vui lòng xác nhận địa chỉ dưới đây:</p>
                    <div className={styles.mapPreview}>
                        <AddressMap address={address} />
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        Xác nhận
                    </button>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h3>Xác nhận</h3>
                </div>
                <div className={styles.modalBody}>
                    <p>{message}</p>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        Xác nhận
                    </button>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UserProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [points, setPoints] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [initialData, setInitialData] = useState({});
    const [showMapConfirmModal, setShowMapConfirmModal] = useState(false);
    const [showDefaultConfirmModal, setShowDefaultConfirmModal] = useState(false);
    const [candidateAddressId, setCandidateAddressId] = useState(null);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [candidateDeleteAddress, setCandidateDeleteAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const userData = await userAPI.getProfile();
                setFullName(userData.fullname || "");
                setEmail(userData.email || "");
                setPhone(userData.phone || "");
                setPoints(userData.loyaltyPoints || 0);
                setAddresses(userData.addresses || []);
                setInitialData({
                    fullname: userData.fullname || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    addresses: userData.addresses || [],
                });
                dispatch(setUser(userData));
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                setError("Không thể tải thông tin người dùng. Vui lòng thử lại!");
                if (
                    error.message.includes("No token found") ||
                    error.message.includes("Invalid or expired token")
                ) {
                    localStorage.removeItem("token");
                    dispatch(clearUser());
                    navigate("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [dispatch, navigate]);

    const validateInputs = () => {
        if (!fullName.trim()) {
            return "Họ tên không được để trống!";
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Email không hợp lệ!";
        }
        if (!phone.trim() || !/^\d{10,11}$/.test(phone)) {
            return "Số điện thoại phải có 10-11 chữ số!";
        }
        return null;
    };

    const handleAddButton = () => {
        if (!newAddress.trim()) {
            alert("Vui lòng nhập địa chỉ!");
            return;
        }
        setShowMapConfirmModal(true);
    };

    const confirmAddAddress = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const newAddrObj = {
                id: addresses.length ? Math.max(...addresses.map((addr) => addr.id)) + 1 : 1,
                address: newAddress,
                isDefault: addresses.length === 0,
            };
            const updatedAddresses = [...addresses, newAddrObj];
            if (!user.id) {
                throw new Error("Không tìm thấy user ID. Vui lòng đăng nhập lại.");
            }
            const updatedUser = await userAPI.updateCustomerProfile(user._id, {
                fullname: fullName,
                email,
                phone,
                addresses: updatedAddresses,
            });
            setAddresses(updatedAddresses);
            dispatch(setUser(updatedUser));
            if (newAddrObj.isDefault) {
                localStorage.setItem("userAddress", newAddress);
                try {
                    const result = await ShopAPI.getShopNearestUser(newAddress);
                    localStorage.setItem("nearestShopId", result.shop._id);
                    console.log("Nearest shop:", result.shop);
                } catch (error) {
                    console.error("Error fetching nearest shop:", error.message);
                }
            }
            setNewAddress("");
            setShowMapConfirmModal(false);
            alert("Thêm địa chỉ thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
            setError("Không thể thêm địa chỉ. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    const cancelAddAddress = () => {
        setShowMapConfirmModal(false);
    };

    const handleSelectAddress = (id) => {
        setCandidateAddressId(id);
        setShowDefaultConfirmModal(true);
    };

    const confirmSetDefault = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedAddresses = addresses.map((addr) =>
                addr.id === candidateAddressId
                    ? { ...addr, isDefault: true }
                    : { ...addr, isDefault: false }
            );
            if (!user.id) {
                throw new Error("Không tìm thấy user ID. Vui lòng đăng nhập lại.");
            }
            const updatedUser = await userAPI.updateCustomerProfile(user.id, {
                fullname: fullName,
                email,
                phone,
                addresses: updatedAddresses,
            });
            setAddresses(updatedAddresses);
            dispatch(setUser(updatedUser));
            const defaultAddress = updatedAddresses.find((addr) => addr.isDefault);
            if (defaultAddress) {
                localStorage.setItem("userAddress", defaultAddress.address);
                try {
                    const result = await ShopAPI.getShopNearestUser(defaultAddress.address);
                    localStorage.setItem("nearestShopId", result.shop._id);
                    console.log("Nearest shop:", result.shop);
                } catch (error) {
                    console.error("Error fetching nearest shop:", error.message);
                }
            }
            setShowDefaultConfirmModal(false);
            setCandidateAddressId(null);
            alert("Đặt địa chỉ mặc định thành công!");
        } catch (error) {
            console.error("Lỗi khi đặt địa chỉ mặc định:", error);
            setError("Không thể đặt địa chỉ mặc định. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    const cancelSetDefault = () => {
        setShowDefaultConfirmModal(false);
        setCandidateAddressId(null);
    };

    const handleRemoveAddress = (id) => {
        const addressToDelete = addresses.find((addr) => addr.id === id);
        if (addressToDelete.isDefault) {
            alert("Không thể xóa địa chỉ mặc định! Vui lòng đặt địa chỉ khác làm mặc định trước.");
            return;
        }
        if (addresses.length === 1) {
            alert("Không thể xóa địa chỉ cuối cùng! Vui lòng thêm một địa chỉ khác trước.");
            return;
        }
        setCandidateDeleteAddress(id);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteAddress = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedAddresses = addresses.filter(
                (addr) => addr.id !== candidateDeleteAddress
            );
            if (!user.id) {
                throw new Error("Không tìm thấy user ID. Vui lòng đăng nhập lại.");
            }
            const updatedUser = await userAPI.updateCustomerProfile(user.id, {
                fullname: fullName,
                email,
                phone,
                addresses: updatedAddresses,
            });
            setAddresses(updatedAddresses);
            dispatch(setUser(updatedUser));
            const defaultAddress = updatedAddresses.find((addr) => addr.isDefault);
            if (defaultAddress) {
                localStorage.setItem("userAddress", defaultAddress.address);
                try {
                    const result = await ShopAPI.getShopNearestUser(defaultAddress.address);
                    localStorage.setItem("nearestShopId", result.shop._id);
                    console.log("Nearest shop:", result.shop);
                } catch (error) {
                    console.error("Error fetching nearest shop:", error.message);
                }
            }
            setShowDeleteConfirmModal(false);
            setCandidateDeleteAddress(null);
            alert("Xóa địa chỉ thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ:", error);
            setError("Không thể xóa địa chỉ. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    const cancelDeleteAddress = () => {
        setShowDeleteConfirmModal(false);
        setCandidateDeleteAddress(null);
    };

    const handleSave = async () => {
        const validationError = validateInputs();
        if (validationError) {
            alert(validationError);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            if (!user.id) {
                throw new Error("Không tìm thấy user ID. Vui lòng đăng nhập lại.");
            }
            const updatedUser = await userAPI.updateCustomerProfile(user.id, {
                fullname: fullName,
                email,
                phone,
                addresses,
            });
            setInitialData({ fullname: fullName, email, phone, addresses });
            dispatch(setUser(updatedUser));
            alert("Thông tin của bạn đã được lưu thành công!");
        } catch (error) {
            console.error("Lỗi khi lưu thông tin:", error);
            setError("Không thể lưu thông tin. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    const isProfileUnchanged =
        fullName === initialData.fullname &&
        email === initialData.email &&
        phone === initialData.phone &&
        JSON.stringify(addresses) === JSON.stringify(initialData.addresses);

    if (isLoading) {
        return (
            <div>
                <Header />
                <div className={styles.profileContainer}>
                    <p>Đang tải thông tin...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className={styles.profileContainer}>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <h1 className={styles.title}>Thông tin cá nhân</h1>
                <div className={styles.personalInfo}>
                    <div className={styles.field}>
                        <label>Họ tên:</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isLoading}
                            placeholder="Nhập họ tên"
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            placeholder="Nhập email"
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Số điện thoại:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isLoading}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Điểm tích:</label>
                        <span className={styles.points}>{points} điểm</span>
                    </div>
                </div>
                <h2 className={styles.subtitle}>Danh sách địa chỉ</h2>
                <ul className={styles.addressList}>
                    {addresses.length === 0 ? (
                        <li className={styles.addressItem}>
                            <p>Chưa có địa chỉ nào. Vui lòng thêm địa chỉ!</p>
                        </li>
                    ) : (
                        addresses.map((addr) => (
                            <li key={addr.id} className={styles.addressItem}>
                                <div className={styles.addressInfo}>
                                    <span className={styles.addressText}>{addr.address}</span>
                                    {addr.isDefault && (
                                        <span className={styles.defaultBadge}>Mặc định</span>
                                    )}
                                </div>
                                <div className={styles.addressActions}>
                                    {!addr.isDefault && (
                                        <button
                                            className={styles.setDefaultButton}
                                            onClick={() => handleSelectAddress(addr.id)}
                                            disabled={isLoading}
                                        >
                                            Đặt làm mặc định
                                        </button>
                                    )}
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => handleRemoveAddress(addr.id)}
                                        disabled={isLoading}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Nhập địa chỉ mới"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        className={styles.addButton}
                        onClick={handleAddButton}
                        disabled={isLoading || !newAddress.trim()}
                    >
                        Thêm
                    </button>
                </div>
                <div className={styles.saveContainer}>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={isProfileUnchanged || isLoading}
                    >
                        Lưu Thông Tin
                    </button>
                </div>
            </div>
            <Footer />
            {showMapConfirmModal && (
                <MapConfirmModal
                    address={newAddress}
                    onConfirm={confirmAddAddress}
                    onCancel={cancelAddAddress}
                />
            )}
            {showDefaultConfirmModal && (
                <ConfirmModal
                    message="Bạn có muốn đặt địa chỉ này làm mặc định?"
                    onConfirm={confirmSetDefault}
                    onCancel={cancelSetDefault}
                />
            )}
            {showDeleteConfirmModal && (
                <ConfirmModal
                    message="Bạn có muốn xóa địa chỉ này?"
                    onConfirm={confirmDeleteAddress}
                    onCancel={cancelDeleteAddress}
                />
            )}
        </div>
    );
}