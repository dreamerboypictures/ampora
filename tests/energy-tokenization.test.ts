import { describe, it, expect, beforeEach } from "vitest"

const mockContract = {
  admin: "STADMIN",
  producers: new Map<string, { name: string; verified: boolean }>(),
  balances: new Map<string, number>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  registerProducer(caller: string, name: string) {
    if (this.producers.has(caller)) return { error: 101 }
    this.producers.set(caller, { name, verified: false })
    return { value: true }
  },

  verifyProducer(caller: string, producer: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    const data = this.producers.get(producer)
    if (!data) return { error: 102 }
    data.verified = true
    return { value: true }
  },

  mintEnergy(caller: string, amount: number) {
    if (amount <= 0) return { error: 103 }
    const data = this.producers.get(caller)
    if (!data) return { error: 102 }
    if (!data.verified) return { error: 100 }
    const prev = this.balances.get(caller) || 0
    this.balances.set(caller, prev + amount)
    return { value: true }
  },

  burnEnergy(caller: string, amount: number) {
    if (amount <= 0) return { error: 103 }
    const prev = this.balances.get(caller) || 0
    if (prev < amount) return { error: 104 }
    this.balances.set(caller, prev - amount)
    return { value: true }
  },

  transferEnergy(from: string, to: string, amount: number) {
    if (amount <= 0) return { error: 103 }
    const fromBal = this.balances.get(from) || 0
    if (fromBal < amount) return { error: 104 }
    const toBal = this.balances.get(to) || 0
    this.balances.set(from, fromBal - amount)
    this.balances.set(to, toBal + amount)
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },
}

describe("Energy Tokenization Contract", () => {
  beforeEach(() => {
    mockContract.admin = "STADMIN"
    mockContract.producers = new Map()
    mockContract.balances = new Map()
  })

  it("registers a new producer", () => {
    const result = mockContract.registerProducer("STPROD1", "SolarCo")
    expect(result).toEqual({ value: true })
  })

  it("verifies a producer by admin", () => {
    mockContract.registerProducer("STPROD1", "SolarCo")
    const result = mockContract.verifyProducer("STADMIN", "STPROD1")
    expect(result).toEqual({ value: true })
  })

  it("mints energy tokens for verified producer", () => {
    mockContract.registerProducer("STPROD1", "SolarCo")
    mockContract.verifyProducer("STADMIN", "STPROD1")
    const result = mockContract.mintEnergy("STPROD1", 100)
    expect(result).toEqual({ value: true })
    expect(mockContract.balances.get("STPROD1")).toBe(100)
  })

  it("fails to mint if not verified", () => {
    mockContract.registerProducer("STPROD1", "SolarCo")
    const result = mockContract.mintEnergy("STPROD1", 100)
    expect(result).toEqual({ error: 100 })
  })

  it("burns energy tokens", () => {
    mockContract.registerProducer("STPROD1", "SolarCo")
    mockContract.verifyProducer("STADMIN", "STPROD1")
    mockContract.mintEnergy("STPROD1", 100)
    const result = mockContract.burnEnergy("STPROD1", 50)
    expect(result).toEqual({ value: true })
    expect(mockContract.balances.get("STPROD1")).toBe(50)
  })

  it("transfers tokens between users", () => {
    mockContract.registerProducer("STPROD1", "SolarCo")
    mockContract.verifyProducer("STADMIN", "STPROD1")
    mockContract.mintEnergy("STPROD1", 100)
    const result = mockContract.transferEnergy("STPROD1", "STUSER1", 60)
    expect(result).toEqual({ value: true })
    expect(mockContract.balances.get("STUSER1")).toBe(60)
    expect(mockContract.balances.get("STPROD1")).toBe(40)
  })

  it("transfers admin role", () => {
    const result = mockContract.transferAdmin("STADMIN", "STNEWADMIN")
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe("STNEWADMIN")
  })
})
