"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Plus, Minus, Zap, Package } from "lucide-react"
import { MonsterCard } from "@/components/card-component"
import type { PokemonCard } from "@/types/card"

const CARDS_PER_PAGE = 25

interface InventoryProps {
  collection: PokemonCard[]
  equippedCards: PokemonCard[]
  onEquipCard: (card: PokemonCard) => void
  onUnequipCard: (cardId: number) => void
  isCardEquipped: (cardId: number) => boolean
}

export function Inventory({ collection, equippedCards, onEquipCard, onUnequipCard, isCardEquipped }: InventoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [rarityFilter, setRarityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(collection.map((card) => card.type))]
    return types.sort()
  }, [collection])

  const filteredCards = useMemo(() => {
    return collection.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRarity = rarityFilter === "all" || card.rarity === rarityFilter
      const matchesType = typeFilter === "all" || card.type === typeFilter
      const matchesAvailability = !showOnlyAvailable || !isCardEquipped(card.id)

      return matchesSearch && matchesRarity && matchesType && matchesAvailability
    })
  }, [collection, searchTerm, rarityFilter, typeFilter, showOnlyAvailable, isCardEquipped])

  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE)
  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE
    return filteredCards.slice(startIndex, startIndex + CARDS_PER_PAGE)
  }, [filteredCards, currentPage])

  const resetFilters = () => {
    setSearchTerm("")
    setRarityFilter("all")
    setTypeFilter("all")
    setShowOnlyAvailable(false)
    setCurrentPage(1)
  }

  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, rarityFilter, typeFilter, showOnlyAvailable])

  return (
    <div className="p-3">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-wider">INVENTORY</h1>
          <p className="text-gray-300 text-sm md:text-base font-semibold">
            Manage your card collection and battle deck
          </p>
        </div>

        {/* Equipped Cards Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-black text-white tracking-wider">ACTIVE BATTLE DECK</h2>
            <div className="bg-gray-700 border border-gray-600 px-2 py-1">
              <span className="text-white text-xs font-bold">{equippedCards.length}/3 EQUIPPED</span>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-3">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="relative">
                  {equippedCards[index] ? (
                    <div className="relative">
                      <div className="relative w-full flex justify-center">
                        <MonsterCard
                            card={equippedCards[index]}
                          variant="equipped"
                          showActions={false}
                        />
                      </div>

                      <Button
                        onClick={() => onUnequipCard(equippedCards[index].id)}
                        className="absolute -top-2 -right-2 w-7 h-7 p-0 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full flex justify-center">
                      <div className="pokemon-card-lg border-2 border-dashed border-gray-600 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-all duration-500 hover:border-gray-500">
                        <div className="text-center text-gray-400">
                          <Plus className="w-10 h-10 mx-auto mb-2 opacity-60" />
                          <div className="text-sm font-bold">EMPTY SLOT</div>
                          <div className="text-xs opacity-75 mt-1">Select from collection</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Collection Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-black text-white tracking-wider">CARD COLLECTION</h2>
            <div className="bg-gray-700 border border-gray-600 px-2 py-1">
              <span className="text-white text-xs font-bold">{filteredCards.length} AVAILABLE</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800 border border-gray-700 p-3 mb-3">
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-8 focus:border-gray-500 transition-all duration-300"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={rarityFilter} onValueChange={setRarityFilter}>
                  <SelectTrigger className="w-28 bg-gray-700 border border-gray-600 text-white h-7 hover:border-gray-500 transition-all duration-300">
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-700">
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-28 bg-gray-700 border border-gray-600 text-white h-7 hover:border-gray-500 transition-all duration-300">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-700">
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                  className={`px-2 h-7 font-bold transition-all duration-300 text-xs ${
                    showOnlyAvailable
                      ? "bg-gray-600 hover:bg-gray-500 border border-gray-500 text-white"
                      : "bg-gray-700 border border-gray-600 text-white hover:bg-gray-600"
                  }`}
                >
                  {showOnlyAvailable ? "AVAILABLE ONLY" : "SHOW ALL"}
                </Button>

                <Button
                  onClick={resetFilters}
                  className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white px-2 h-7 font-bold transition-all duration-300 text-xs"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  RESET
                </Button>
              </div>

              {/* Results Info */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-white font-semibold">
                  Showing {paginatedCards.length} of {filteredCards.length} cards
                </span>
                {totalPages > 1 && (
                  <span className="text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-5 gap-2">
            {paginatedCards.map((card, index) => (
              <div key={`${card.id}-${index}`} className="relative">
                <div className="w-full flex justify-center">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (isCardEquipped(card.id)) {
                        onUnequipCard(card.id)
                      } else if (equippedCards.length < 3) {
                        onEquipCard(card)
                      }
                    }}
                  >
                    <MonsterCard
                      card={card}
                      variant="compact"
                      isEquipped={isCardEquipped(card.id)}
                      showActions={false}
                    />
                  </div>
                </div>

                {/* Status indicators and buttons */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Equipped indicator */}
                  {isCardEquipped(card.id) && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <Badge className="bg-gray-600 text-white text-xs px-2 py-0.5 shadow-xl border border-gray-500 pointer-events-auto">
                        <Star className="w-2 h-2 mr-1" />
                        EQUIPPED
                      </Badge>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 pointer-events-auto z-10">
                    {isCardEquipped(card.id) ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          onUnequipCard(card.id)
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 border border-gray-600 shadow-xl transition-all duration-300"
                      >
                        <Minus className="w-2 h-2 mr-1" />
                        UNEQUIP
                      </Button>
                    ) : equippedCards.length < 3 ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEquipCard(card)
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 border border-gray-600 shadow-xl transition-all duration-300"
                      >
                        <Plus className="w-2 h-2 mr-1" />
                        EQUIP
                      </Button>
                    ) : (
                      <Button disabled className="bg-gray-600 text-white text-xs py-1 px-2 shadow-xl opacity-50">
                        DECK FULL
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-3">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50 px-3 py-1 font-bold transition-all duration-300 text-xs"
              >
                PREVIOUS
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page
                  if (totalPages <= 5) {
                    page = i + 1
                  } else if (currentPage <= 3) {
                    page = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i
                  } else {
                    page = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 font-bold transition-all duration-300 text-xs ${
                        currentPage === page
                          ? "bg-gray-600 text-white border border-gray-500"
                          : "bg-gray-700 border border-gray-600 text-white hover:bg-gray-600"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              <Button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50 px-3 py-1 font-bold transition-all duration-300 text-xs"
              >
                NEXT
              </Button>
            </div>
          )}

          {/* Empty state */}
          {filteredCards.length === 0 && (
            <div className="text-center py-6">
              <div className="text-gray-400 text-lg mb-2 font-bold">NO CARDS FOUND</div>
              <div className="text-gray-500 text-sm mb-3">Try adjusting your search or filters</div>
              <Button
                onClick={resetFilters}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 font-bold transition-all duration-300"
              >
                CLEAR FILTERS
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
