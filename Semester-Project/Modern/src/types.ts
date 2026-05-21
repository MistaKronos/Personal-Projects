export interface StaffMember {
  id: string
  name: string
  surname: string
  picture: string
  email: string
  status: 'In' | 'Out'
  outTime: string
  duration: string
  expectedReturnTime: string
  expectedReturnTimeDate: Date | null
  lastClockInTime: Date | null
}

export interface DeliveryDriver {
  id: string
  name: string
  surname: string
  vehicle: 'Motorcycle' | 'Car'
  phone: string
  deliveryAddress: string
  returnTime: string
}
