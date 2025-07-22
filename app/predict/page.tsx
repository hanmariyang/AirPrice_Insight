"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Home,
  Users,
  Wifi,
  Car,
  ChefHat,
  Waves,
  Dumbbell,
  TreePine,
  Snowflake,
  Flame,
  Check,
  Search,
  Building,
  Building2,
  Castle,
  Warehouse,
} from "lucide-react"
import Link from "next/link"

interface PropertyData {
  propertyType: string
  address: string
  bedrooms: string
  bathrooms: string
  maxGuests: string
  amenities: string[]
  latitude: number
  longitude: number
}

const propertyTypeOptions = [
  { value: "apartment", label: "아파트", icon: Building, description: "일반적인 아파트 형태" },
  { value: "house", label: "단독주택", icon: Home, description: "독립된 주택" },
  { value: "condo", label: "콘도", icon: Building2, description: "콘도미니엄" },
  { value: "studio", label: "원룸", icon: Warehouse, description: "스튜디오 타입" },
  { value: "villa", label: "빌라", icon: Castle, description: "빌라/연립주택" },
]

const amenitiesList = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi, color: "bg-blue-100 text-blue-700" },
  { id: "parking", label: "주차장", icon: Car, color: "bg-green-100 text-green-700" },
  { id: "kitchen", label: "주방", icon: ChefHat, color: "bg-orange-100 text-orange-700" },
  { id: "pool", label: "수영장", icon: Waves, color: "bg-cyan-100 text-cyan-700" },
  { id: "gym", label: "헬스장", icon: Dumbbell, color: "bg-red-100 text-red-700" },
  { id: "balcony", label: "발코니", icon: TreePine, color: "bg-emerald-100 text-emerald-700" },
  { id: "aircon", label: "에어컨", icon: Snowflake, color: "bg-sky-100 text-sky-700" },
  { id: "heating", label: "난방", icon: Flame, color: "bg-amber-100 text-amber-700" },
]

const addressSuggestions = [
  "서울특별시 강남구 테헤란로",
  "서울특별시 마포구 홍대입구역",
  "서울특별시 종로구 명동",
  "서울특별시 용산구 이태원로",
  "서울특별시 서초구 강남역",
]

export default function PredictPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)
  const [propertyData, setPropertyData] = useState<PropertyData>({
    propertyType: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    maxGuests: "",
    amenities: [],
    latitude: 37.5665,
    longitude: 126.978,
  })

  const progress = (step / 3) * 100

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setPropertyData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenityId] : prev.amenities.filter((id) => id !== amenityId),
    }))
  }

  const handleAddressSelect = (address: string) => {
    setPropertyData((prev) => ({ ...prev, address }))
    setShowAddressSuggestions(false)
  }

  const handleSubmit = () => {
    localStorage.setItem("propertyData", JSON.stringify(propertyData))
    router.push("/results")
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return propertyData.propertyType && propertyData.address
      case 2:
        return propertyData.bedrooms && propertyData.bathrooms && propertyData.maxGuests
      case 3:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (canProceed() && step < 3) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">홈으로</span>
            </Link>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <span>진행률</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>

              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      i < step
                        ? "bg-green-500 text-white"
                        : i === step
                          ? "bg-black text-white ring-4 ring-black/20"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i < step ? <Check className="w-4 h-4" /> : i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Form Section */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 1 && "숙소 기본 정보"}
                {step === 2 && "숙소 상세 정보"}
                {step === 3 && "편의시설 선택"}
              </h1>
              <p className="text-gray-600">
                {step === 1 && "숙소의 유형과 위치를 알려주세요"}
                {step === 2 && "숙소의 규모와 수용 인원을 입력해주세요"}
                {step === 3 && "제공하는 편의시설을 선택해주세요 (선택사항)"}
              </p>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-right-5 duration-300">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Home className="w-5 h-5" />
                        <span>숙소 유형</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {propertyTypeOptions.map((option) => (
                          <div
                            key={option.value}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                              propertyData.propertyType === option.value
                                ? "border-black bg-black text-white"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setPropertyData((prev) => ({ ...prev, propertyType: option.value }))}
                          >
                            <div className="flex items-center space-x-3">
                              <option.icon className="w-6 h-6" />
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div
                                  className={`text-sm ${propertyData.propertyType === option.value ? "text-gray-300" : "text-gray-500"}`}
                                >
                                  {option.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5" />
                        <span>위치</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="주소를 입력하세요 (예: 서울특별시 강남구 테헤란로)"
                            value={propertyData.address}
                            onChange={(e) => {
                              setPropertyData((prev) => ({ ...prev, address: e.target.value }))
                              setShowAddressSuggestions(e.target.value.length > 0)
                            }}
                            onFocus={() => setShowAddressSuggestions(propertyData.address.length > 0)}
                            className="pl-10 h-12 text-base"
                          />
                        </div>

                        {showAddressSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                            {addressSuggestions
                              .filter((addr) => addr.toLowerCase().includes(propertyData.address.toLowerCase()))
                              .map((address, index) => (
                                <div
                                  key={index}
                                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  onClick={() => handleAddressSelect(address)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{address}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview Section for Step 1 */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>실시간 미리보기</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Property Type */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">숙소 유형</span>
                        </div>
                        <span className="font-medium">
                          {propertyData.propertyType
                            ? propertyTypeOptions.find((opt) => opt.value === propertyData.propertyType)?.label
                            : "미선택"}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-600">위치</span>
                        </div>
                        <span className="font-medium text-right text-sm max-w-32">
                          {propertyData.address || "미입력"}
                        </span>
                      </div>

                      {/* Room Details */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">침실</div>
                          <div className="font-semibold">
                            {propertyData.bedrooms ? `${propertyData.bedrooms}개` : "-"}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">욕실</div>
                          <div className="font-semibold">
                            {propertyData.bathrooms ? `${propertyData.bathrooms}개` : "-"}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">인원</div>
                          <div className="font-semibold">
                            {propertyData.maxGuests ? `${propertyData.maxGuests}명` : "-"}
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="text-sm text-gray-600 mb-2">편의시설</div>
                        {propertyData.amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {propertyData.amenities.slice(0, 4).map((amenityId) => {
                              const amenity = amenitiesList.find((a) => a.id === amenityId)
                              return (
                                <Badge key={amenityId} variant="secondary" className="text-xs">
                                  {amenity?.label}
                                </Badge>
                              )
                            })}
                            {propertyData.amenities.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{propertyData.amenities.length - 4}개
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">선택된 편의시설 없음</span>
                        )}
                      </div>

                      {/* Completion Status */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">완료도</span>
                          <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="mt-2 text-xs text-gray-600">
                          {step === 1 && "기본 정보를 입력해주세요"}
                          {step === 2 && "숙소 상세 정보를 입력해주세요"}
                          {step === 3 && "편의시설을 선택해주세요"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-right-5 duration-300">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>숙소 규모</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-3 block">침실 수</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                className={`p-3 text-center border-2 rounded-lg transition-all duration-200 ${
                                  propertyData.bedrooms === num.toString()
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => setPropertyData((prev) => ({ ...prev, bedrooms: num.toString() }))}
                              >
                                <div className="font-semibold">{num}</div>
                                <div className="text-xs mt-1">개</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-3 block">욕실 수</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4].map((num) => (
                              <button
                                key={num}
                                className={`p-3 text-center border-2 rounded-lg transition-all duration-200 ${
                                  propertyData.bathrooms === num.toString()
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => setPropertyData((prev) => ({ ...prev, bathrooms: num.toString() }))}
                              >
                                <div className="font-semibold">{num}</div>
                                <div className="text-xs mt-1">개</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-3 block">최대 인원</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <button
                                key={num}
                                className={`p-3 text-center border-2 rounded-lg transition-all duration-200 ${
                                  propertyData.maxGuests === num.toString()
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => setPropertyData((prev) => ({ ...prev, maxGuests: num.toString() }))}
                              >
                                <div className="font-semibold">{num}</div>
                                <div className="text-xs mt-1">명</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview Section for Step 2 */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>실시간 미리보기</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Property Type */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">숙소 유형</span>
                        </div>
                        <span className="font-medium">
                          {propertyData.propertyType
                            ? propertyTypeOptions.find((opt) => opt.value === propertyData.propertyType)?.label
                            : "미선택"}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-600">위치</span>
                        </div>
                        <span className="font-medium text-right text-sm max-w-32">
                          {propertyData.address || "미입력"}
                        </span>
                      </div>

                      {/* Room Details */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">침실</div>
                          <div className="font-semibold">
                            {propertyData.bedrooms ? `${propertyData.bedrooms}개` : "-"}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">욕실</div>
                          <div className="font-semibold">
                            {propertyData.bathrooms ? `${propertyData.bathrooms}개` : "-"}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">인원</div>
                          <div className="font-semibold">
                            {propertyData.maxGuests ? `${propertyData.maxGuests}명` : "-"}
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="text-sm text-gray-600 mb-2">편의시설</div>
                        {propertyData.amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {propertyData.amenities.slice(0, 4).map((amenityId) => {
                              const amenity = amenitiesList.find((a) => a.id === amenityId)
                              return (
                                <Badge key={amenityId} variant="secondary" className="text-xs">
                                  {amenity?.label}
                                </Badge>
                              )
                            })}
                            {propertyData.amenities.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{propertyData.amenities.length - 4}개
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">선택된 편의시설 없음</span>
                        )}
                      </div>

                      {/* Completion Status */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">완료도</span>
                          <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="mt-2 text-xs text-gray-600">
                          {step === 1 && "기본 정보를 입력해주세요"}
                          {step === 2 && "숙소 상세 정보를 입력해주세요"}
                          {step === 3 && "편의시설을 선택해주세요"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 3: Amenities */}
            {step === 3 && (
              <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-right-5 duration-300">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>편의시설 선택</CardTitle>
                      <p className="text-sm text-gray-600">게스트에게 제공하는 편의시설을 모두 선택해주세요</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {amenitiesList.map((amenity) => (
                          <div
                            key={amenity.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                              propertyData.amenities.includes(amenity.id)
                                ? "border-black bg-black text-white"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() =>
                              handleAmenityChange(amenity.id, !propertyData.amenities.includes(amenity.id))
                            }
                          >
                            <div className="text-center">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                                  propertyData.amenities.includes(amenity.id) ? "bg-white/20" : amenity.color
                                }`}
                              >
                                <amenity.icon className="w-6 h-6" />
                              </div>
                              <div className="font-medium text-sm">{amenity.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {propertyData.amenities.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 text-green-800 mb-2">
                            <Check className="w-4 h-4" />
                            <span className="font-medium">선택된 편의시설 ({propertyData.amenities.length}개)</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {propertyData.amenities.map((amenityId) => {
                              const amenity = amenitiesList.find((a) => a.id === amenityId)
                              return (
                                <Badge key={amenityId} variant="secondary" className="bg-green-100 text-green-800">
                                  {amenity?.label}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Preview Section for Step 3 */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>실시간 미리보기</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Property Type */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">숙소 유형</span>
                        </div>
                        <span className="font-medium">
                          {propertyData.propertyType
                            ? propertyTypeOptions.find((opt) => opt.value === propertyData.propertyType)?.label
                            : "미선택"}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-600">위치</span>
                        </div>
                        <span className="font-medium text-right text-sm max-w-32">
                          {propertyData.address || "미입력"}
                        </span>
                      </div>

                      {/* Room Details */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">침실</div>
                          <div className="font-semibold">
                            {propertyData.bedrooms ? `${propertyData.bedrooms}개` : "-"}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">욕실</div>
                          <div className="font-semibold">
                            {propertyData.bathrooms ? `${propertyData.bathrooms}개` : "-"}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border text-center">
                          <div className="text-xs text-gray-600 mb-1">인원</div>
                          <div className="font-semibold">
                            {propertyData.maxGuests ? `${propertyData.maxGuests}명` : "-"}
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="text-sm text-gray-600 mb-2">편의시설</div>
                        {propertyData.amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {propertyData.amenities.slice(0, 4).map((amenityId) => {
                              const amenity = amenitiesList.find((a) => a.id === amenityId)
                              return (
                                <Badge key={amenityId} variant="secondary" className="text-xs">
                                  {amenity?.label}
                                </Badge>
                              )
                            })}
                            {propertyData.amenities.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{propertyData.amenities.length - 4}개
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">선택된 편의시설 없음</span>
                        )}
                      </div>

                      {/* Completion Status */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">완료도</span>
                          <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="mt-2 text-xs text-gray-600">
                          {step === 1 && "기본 정보를 입력해주세요"}
                          {step === 2 && "숙소 상세 정보를 입력해주세요"}
                          {step === 3 && "편의시설을 선택해주세요"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center space-x-2 px-6 py-3 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>이전</span>
              </Button>

              {step < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2 bg-black hover:bg-gray-800 px-6 py-3"
                >
                  <span>다음</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-700 px-8 py-3 text-lg font-medium"
                >
                  <span>AI 가격 예측 시작</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
