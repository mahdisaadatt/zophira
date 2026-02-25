'use client';

import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  ShoppingCart,
  Edit,
  Save,
  Key,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Phone,
  Mail,
  Calendar,
  Settings,
  Heart,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Define types for our data
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
}

interface Order {
  id: string;
  createdAt: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  subtotal: number;
  shippingFee: number;
  shippingMethod?: 'REGULAR_POST' | 'TIPAX';
  trackingNumber?: string;
  orderNumber?: string;
  items: OrderItem[];
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  orders: Order[];
  loyaltyPoints?: number;
}

export default function ProfileClientPage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/user/profile');
          if (!response.ok) {
            throw new Error('Failed to fetch profile data.');
          }
          const data = await response.json();
          setProfileData(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchProfileData();
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profileData) {
      const { id, value } = e.target;
      setProfileData({ ...profileData, [id]: value });
    }
  };

  const handleSave = async () => {
    if (!profileData) return;

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile.');
      }

      const result = await response.json();
      toast.success(result.message || 'پروفایل با موفقیت به روز شد.');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'خطایی در به‌روزرسانی پروفایل رخ داد');
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('لطفا تمام فیلدها را پر کنید');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('رمز عبور جدید و تکرار آن یکسان نیستند');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('رمز عبور جدید باید حداقل 8 کاراکتر باشد');
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'خطا در تغییر رمز عبور');
      }

      const result = await response.json();
      toast.success(result.message || 'رمز عبور با موفقیت تغییر کرد');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      toast.error(err.message || 'خطایی در تغییر رمز عبور رخ داد');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <Loading fullScreen label="در حال بارگذاری پروفایل..." />;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto my-12 text-center">
        <h1 className="text-2xl font-bold">دسترسی غیرمجاز</h1>
        <p>لطفا برای مشاهده این صفحه وارد حساب کاربری خود شوید.</p>
        <Button
          onClick={() => (window.location.href = '/login')}
          className="mt-4"
        >
          ورود به حساب کاربری
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-12 text-center text-red-500">
        خطا: {error}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto my-12 text-center">
        اطلاعات پروفایل یافت نشد.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-mint-50 text-right">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl border border-cyan-100">
          <div className="relative bg-gradient-to-l from-cyan-500 via-teal-500 to-mint-500 px-4 sm:px-8 py-8 sm:py-12">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-white text-xl sm:text-2xl font-bold text-cyan-600">
                    {profileData.firstName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-right">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {profileData.firstName}
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-white/90">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                    <Mail className="h-4 w-4 text-white" />
                    <span className="text-sm sm:text-base font-medium">
                      {profileData.email}
                    </span>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Phone className="h-4 w-4 text-white" />
                      <span className="text-sm sm:text-base font-medium">
                        {profileData.phone}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 shadow-lg"
                  >
                    <Calendar className="h-3 w-3 ml-1" />
                    عضو از{' '}
                    {new Date(profileData.createdAt).toLocaleDateString(
                      'fa-IR'
                    )}
                  </Badge>
                  {profileData.loyaltyPoints && (
                    <Badge
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm text-white border-white/30 shadow-lg"
                    >
                      <Heart className="h-3 w-3 ml-1" />
                      {profileData.loyaltyPoints} امتیاز وفاداری
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs dir="rtl" defaultValue="account" className="w-full text-right">
          <div className="flex">
            <TabsList className="inline-flex h-auto items-center justify-center rounded-lg bg-gray-200 p-1.5">
              <TabsTrigger
                value="account"
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <User className="h-5 w-5" /> پروفایل
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <ShoppingCart className="h-5 w-5" /> سفارشات
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <Key className="h-5 w-5" /> تغییر رمز عبور
              </TabsTrigger>
              {/* <TabsTrigger
                value="address"
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <MapPin className="h-5 w-5" /> آدرس
              </TabsTrigger> */}
            </TabsList>
          </div>

          <TabsContent value="account" className="mt-6 text-right">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">اطلاعات شخصی</CardTitle>
                <CardDescription>
                  اطلاعات پروفایل خود را در اینجا ویرایش کنید.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره تماس</Label>
                  <Input
                    id="phone"
                    value={profileData.phone || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-right"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                <p className="text-sm text-gray-500">
                  برای ویرایش، روی دکمه کلیک کنید.
                </p>
                <Button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                >
                  {isEditing ? (
                    <Save className="mr-2 h-4 w-4" />
                  ) : (
                    <Edit className="mr-2 h-4 w-4" />
                  )}
                  {isEditing ? 'ذخیره' : 'ویرایش'}
                </Button>
              </CardFooter>
            </Card>


          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">سفارشات من</CardTitle>
                <CardDescription>
                  اطلاعات سفارشات خود را در اینجا مشاهده کنید.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {profileData.orders && profileData.orders.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {profileData.orders.map((order, index) => {
                      const getStatusInfo = (status: string) => {
                        switch (status) {
                          case 'DELIVERED':
                            return {
                              icon: CheckCircle,
                              color: 'text-green-600',
                              bg: 'bg-green-50',
                              border: 'border-green-200',
                              text: 'تحویل شده',
                            };
                          case 'SHIPPED':
                            return {
                              icon: Truck,
                              color: 'text-blue-600',
                              bg: 'bg-blue-50',
                              border: 'border-blue-200',
                              text: 'ارسال شده',
                            };
                          case 'PROCESSING':
                            return {
                              icon: Clock,
                              color: 'text-yellow-600',
                              bg: 'bg-yellow-50',
                              border: 'border-yellow-200',
                              text: 'در حال پردازش',
                            };
                          case 'CONFIRMED':
                            return {
                              icon: CheckCircle,
                              color: 'text-cyan-600',
                              bg: 'bg-cyan-50',
                              border: 'border-cyan-200',
                              text: 'تایید شده',
                            };
                          default:
                            return {
                              icon: Clock,
                              color: 'text-gray-600',
                              bg: 'bg-gray-50',
                              border: 'border-gray-200',
                              text: 'در انتظار',
                            };
                        }
                      };

                      const statusInfo = getStatusInfo(order.status);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <div
                          key={order.id}
                          className="p-6 hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                  سفارش #
                                  {order.orderNumber || order.id.slice(-8)}
                                </h3>
                                <Badge
                                  className={`${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border hover:bg-primary/20`}
                                >
                                  <StatusIcon className="h-3 w-3 ml-1" />
                                  {statusInfo.text}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(order.createdAt).toLocaleDateString(
                                    'fa-IR'
                                  )}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ShoppingCart className="h-4 w-4" />
                                  {order.items?.length || 0} محصول
                                </span>
                                {order.shippingMethod && (
                                  <span className="flex items-center gap-1">
                                    <Truck className="h-4 w-4" />
                                    {order.shippingMethod === 'TIPAX' ? 'تیپاکس' : 'پست معمولی'}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">مبلغ محصولات:</span>
                                  <span className="font-medium">
                                    {(order.subtotal || order.total - (order.shippingFee || 0)).toLocaleString('fa-IR')} تومان
                                  </span>
                                </div>
                                {order.shippingFee > 0 && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                      <Truck className="h-3 w-3" />
                                      هزینه ارسال:
                                    </span>
                                    <span className="font-medium">
                                      {order.shippingFee.toLocaleString('fa-IR')} تومان
                                    </span>
                                  </div>
                                )}
                                {order.shippingFee === 0 && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                      <Truck className="h-3 w-3" />
                                      هزینه ارسال:
                                    </span>
                                    <span className="font-medium text-green-600">رایگان</span>
                                  </div>
                                )}
                                <div className="border-t pt-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">مجموع:</span>
                                    <span className="text-xl font-bold text-gray-900">
                                      {order.total.toLocaleString('fa-IR')} تومان
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {order.items && order.items.length > 0 && (
                            <div className="mt-4">
                              <div className="space-y-2">
                                {order.items
                                  .slice(0, 3)
                                  .map((item, itemIndex) => (
                                    <div
                                      key={itemIndex}
                                      className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                                        <span className="font-medium text-gray-800">
                                          {item.product.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>×{item.quantity}</span>
                                        <span className="font-semibold">
                                          {item.price.toLocaleString('fa-IR')} ت
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                {order.items.length > 3 && (
                                  <div className="text-center py-2">
                                    <span className="text-sm text-gray-500">
                                      و {order.items.length - 3} محصول دیگر...
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="h-10 w-10 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      هیچ سفارشی یافت نشد
                    </h3>
                    <p className="text-gray-600 mb-6">
                      شما هنوز هیچ سفارشی ثبت نکرده‌اید
                    </p>
                    <Button
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 py-2"
                      onClick={() => (window.location.href = '/products')}
                    >
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      مشاهده محصولات
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">تغییر رمز عبور</CardTitle>
                <CardDescription>
                  برای امنیت بیشتر، رمز عبور خود را به طور منظم تغییر دهید.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-1 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        type={showCurrentPassword ? "text" : "password"}
                        dir="ltr"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="رمز عبور فعلی خود را وارد کنید"
                        className="text-left pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">رمز عبور جدید</Label>
                    <div className="relative">
                      <Input 
                        id="newPassword" 
                        type={showNewPassword ? "text" : "password"}
                        dir="ltr"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="رمز عبور جدید (حداقل 8 کاراکتر)"
                        className="text-left pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"}
                        dir="ltr"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="رمز عبور جدید را مجدداً وارد کنید"
                        className="text-left pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Settings className="h-5 w-5 text-cyan-600 mt-0.5" />
                    </div>
                    <div className="text-sm">
                      <h4 className="font-semibold text-cyan-800 mb-1">نکات امنیتی:</h4>
                      <ul className="text-cyan-700 space-y-1">
                        <li>• رمز عبور باید حداقل 8 کاراکتر باشد</li>
                        <li>• از ترکیب حروف بزرگ و کوچک، اعداد و علائم استفاده کنید</li>
                        <li>• از رمزهای قابل حدس مانند تاریخ تولد خودداری کنید</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button 
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                >
                  {isChangingPassword ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Key className="ml-2 h-4 w-4" />
                  )}
                  {isChangingPassword ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* <TabsContent value="address" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">آدرس‌های من</CardTitle>
                <CardDescription>
                  آدرس‌های ثبت شده برای ارسال سفارشات.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-gray-50 p-6">
                  <p className="font-semibold text-gray-800">
                    {profileData.firstName} {profileData.lastName}
                  </p>
                  <p className="mt-2 text-gray-600">
                    {profileData.address || 'آدرسی ثبت نشده است.'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    تلفن: {profileData.phone || '-'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-start border-t px-6 py-4">
                <Button variant="outline">ویرایش یا افزودن آدرس جدید</Button>
              </CardFooter>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
