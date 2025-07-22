"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Download,
  MapPin,
  TrendingUp,
  Users,
  Star,
  Wifi,
  Home,
  Target,
  BarChart3,
  Zap,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("@/components/map-component"), { ssr: false })

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

interface PredictionResult {
  predictedPrice: number
  confidence: number
  priceRange: { min: number; max: number }
  factors: { factor: string; impact: string; description: string; positive: boolean }[]
}

interface SimilarProperty {
  id: string
  name: string
  price: number
  rating: number
  distance: number
  bedrooms: number
  bathrooms: number
  maxGuests: number
  image: string
}

const loadingSteps = [
  { step: 1, message: "숙소 정보 분석 중...", icon: Home },
  { step: 2, message: "주변 시세 데이터 수집 중...", icon: MapPin },
  { step: 3, message: "AI 모델 예측 실행 중...", icon: Zap },
  { step: 4, message: "유사 매물 검색 중...", icon: Users },
  { step: 5, message: "최종 분석 완료!", icon: CheckCircle },
]

export default function ResultsPage() {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [similarProperties, setSimilarProperties] = useState<SimilarProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const storedData = localStorage.getItem("propertyData")
    if (storedData) {
      const data = JSON.parse(storedData)
      setPropertyData(data)

      // Enhanced loading simulation
      const loadingInterval = setInterval(() => {
        setCurrentLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1
          }
          return prev
        })
        setLoadingProgress((prev) => {
          if (prev < 100) {
            return prev + 20
          }
          return prev
        })
      }, 800)

      setTimeout(() => {
        clearInterval(loadingInterval)

        const mockPrediction: PredictionResult = {
          predictedPrice: Math.floor(Math.random() * 50000) + 80000,
          confidence: Math.floor(Math.random() * 20) + 80,
          priceRange: { min: 70000, max: 120000 },
          factors: [
            { factor: "위치", impact: "+15%", description: "강남구 역세권 위치로 프리미엄", positive: true },
            { factor: "편의시설", impact: "+8%", description: "Wi-Fi, 주방 등 필수 시설 완비", positive: true },
            { factor: "숙소 크기", impact: "+5%", description: `${data.bedrooms}개 침실로 적정 규모`, positive: true },
            { factor: "신규 호스트", impact: "-10%", description: "호스트 평점 부재로 할인 필요", positive: false },
          ],
        }
        setPrediction(mockPrediction)

        const mockSimilarProperties: SimilarProperty[] = [
          {
            id: "1",
            name: "강남역 도보 5분 모던 아파트",
            price: 95000,
            rating: 4.8,
            distance: 0.3,
            bedrooms: Number.parseInt(data.bedrooms),
            bathrooms: Number.parseInt(data.bathrooms),
            maxGuests: Number.parseInt(data.maxGuests),
            image: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "2",
            name: "테헤란로 신축 오피스텔",
            price: 88000,
            rating: 4.6,
            distance: 0.5,
            bedrooms: Number.parseInt(data.bedrooms),
            bathrooms: Number.parseInt(data.bathrooms),
            maxGuests: Number.parseInt(data.maxGuests),
            image: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "3",
            name: "역삼동 깔끔한 원룸",
            price: 75000,
            rating: 4.4,
            distance: 0.8,
            bedrooms: Number.parseInt(data.bedrooms),
            bathrooms: Number.parseInt(data.bathrooms),
            maxGuests: Number.parseInt(data.maxGuests),
            image: "/placeholder.svg?height=200&width=300",
          },
        ]
        setSimilarProperties(mockSimilarProperties)
        setLoading(false)
      }, 4500)
    }
  }, [])

  const handleDownloadReport = () => {
    alert("PDF 리포트 다운로드 기능은 실제 구현에서 제공됩니다.")
  }

  if (loading || !propertyData || !prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  {currentLoadingStep < loadingSteps.length && <Home className="w-8 h-8 text-white" />}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">AI 가격 분석 중</h2>
                <p className="text-gray-600">
                  {currentLoadingStep < loadingSteps.length && loadingSteps[currentLoadingStep].message}
                </p>
              </div>

              <div className="space-y-4">
                <Progress value={loadingProgress} className="h-3" />
                <div className="text-sm text-gray-500">{loadingProgress}% 완료</div>
              </div>

              <div className="mt-6 space-y-2">
                {loadingSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                      index <= currentLoadingStep ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        index < currentLoadingStep
                          ? "bg-green-500"
                          : index === currentLoadingStep
                            ? "bg-black"
                            : "bg-gray-200"
                      }`}
                    >
                      {index < currentLoadingStep ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <div
                          className={`w-2 h-2 rounded-full ${index === currentLoadingStep ? "bg-white animate-pulse" : "bg-gray-400"}`}
                        />
                      )}
                    </div>
                    <span>{step.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/predict"
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">다시 예측하기</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                분석 완료
              </Badge>
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Download className="w-4 h-4" />
                <span>PDF 다운로드</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Prediction Result */}
        <Card className="border-0 shadow-xl mb-8 bg-gradient-to-r from-white to-gray-50 animate-in slide-in-from-bottom-5 duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span>AI 가격 예측 결과</span>
            </CardTitle>
            <p className="text-gray-600">머신러닝 모델이 분석한 최적 가격을 확인하세요</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2 text-center">
                <div className="relative">
                  <div className="text-5xl font-bold text-black mb-2 animate-in zoom-in-50 duration-700 delay-200">
                    ₩{prediction.predictedPrice.toLocaleString()}
                  </div>
                  <p className="text-gray-600 text-lg">예측 가격 (1박 기준)</p>
                  <div className="flex items-center justify-center mt-4 space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      신뢰도 {prediction.confidence}%
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-700 mb-2">
                  ₩{prediction.priceRange.min.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mb-1">최저 권장가</div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">
                  ₩{prediction.priceRange.max.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">최고 권장가</div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">주요 가격 요인</h4>
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                    <span className="text-sm text-gray-600">{factor.factor}</span>
                    <Badge
                      variant={factor.positive ? "default" : "secondary"}
                      className={factor.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {factor.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest of the component remains the same... */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Visualization */}
          <Card className="border-0 shadow-lg animate-in slide-in-from-left-5 duration-500 delay-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>주변 가격 분포</span>
              </CardTitle>
              <p className="text-sm text-gray-600">유사한 숙소들의 위치와 가격을 확인하세요</p>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                <MapComponent center={[propertyData.latitude, propertyData.longitude]} properties={similarProperties} />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Property Summary */}
          <Card className="border-0 shadow-lg animate-in slide-in-from-right-5 duration-500 delay-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>입력하신 숙소 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">숙소 유형</p>
                  <p className="font-semibold">{propertyData.propertyType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">위치</p>
                  <p className="font-semibold text-sm">{propertyData.address}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">침실/욕실</p>
                  <p className="font-semibold">
                    {propertyData.bedrooms}개 / {propertyData.bathrooms}개
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">최대 인원</p>
                  <p className="font-semibold">{propertyData.maxGuests}명</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">편의시설</p>
                <div className="flex flex-wrap gap-2">
                  {propertyData.amenities.length > 0 ? (
                    propertyData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="bg-white">
                        {amenity === "wifi" && <Wifi className="w-3 h-3 mr-1" />}
                        {amenity}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">선택된 편의시설 없음</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Similar Properties */}
        <Card className="border-0 shadow-lg mt-8 animate-in slide-in-from-bottom-5 duration-500 delay-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>유사 매물 비교</span>
            </CardTitle>
            <p className="text-sm text-gray-600">비슷한 조건의 숙소들과 가격을 비교해보세요</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {similarProperties.map((property, index) => (
                <Card
                  key={property.id}
                  className="border border-gray-200 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{property.name}</h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-black">₩{property.price.toLocaleString()}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{property.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>침실/욕실:</span>
                        <span className="font-medium">
                          {property.bedrooms}개 / {property.bathrooms}개
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>최대 인원:</span>
                        <span className="font-medium">{property.maxGuests}명</span>
                      </div>
                      <div className="flex justify-between">
                        <span>거리:</span>
                        <span className="font-medium">{property.distance}km</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">예측가 대비</span>
                        <Badge variant={property.price > prediction.predictedPrice ? "destructive" : "secondary"}>
                          {property.price > prediction.predictedPrice ? "+" : ""}
                          {Math.round(((property.price - prediction.predictedPrice) / prediction.predictedPrice) * 100)}
                          %
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Price Recommendation Guide */}
        <Card className="border-0 shadow-lg mt-8 animate-in slide-in-from-bottom-5 duration-500 delay-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>가격 설정 가이드</span>
            </CardTitle>
            <p className="text-sm text-gray-600">데이터 기반의 가격 설정 전략을 제안드립니다</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">가격 요인 상세 분석</h4>
                <div className="space-y-4">
                  {prediction.factors.map((factor, index) => (
                    <div
                      key={index}
                      className={`border-l-4 pl-4 p-3 rounded-r-lg ${
                        factor.positive ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{factor.factor}</span>
                        <Badge
                          variant={factor.positive ? "default" : "secondary"}
                          className={factor.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {factor.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">추천 가격 전략</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-green-800">경쟁력 있는 가격</h5>
                      <Badge className="bg-green-600">추천</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-900 mb-1">
                      ₩{Math.floor(prediction.predictedPrice * 0.9).toLocaleString()}
                    </div>
                    <p className="text-sm text-green-700">빠른 예약 확보 및 초기 리뷰 수집에 유리</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-2">균형 잡힌 가격</h5>
                    <div className="text-2xl font-bold text-blue-900 mb-1">
                      ₩{prediction.predictedPrice.toLocaleString()}
                    </div>
                    <p className="text-sm text-blue-700">수익과 예약률의 최적 균형점</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <h5 className="font-medium text-orange-800 mb-2">프리미엄 가격</h5>
                    <div className="text-2xl font-bold text-orange-900 mb-1">
                      ₩{Math.floor(prediction.predictedPrice * 1.1).toLocaleString()}
                    </div>
                    <p className="text-sm text-orange-700">높은 수익률 추구 (예약률 다소 감소 가능)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
