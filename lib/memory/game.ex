defmodule Memory.Game do
	def new do
		%{
			tile_order_unmasked: initialize_tiles(),
			tile_order_masked: initialize_masked(),
			tile_matched: initialize_matched(),
			score: initialize_score(),
			first_tile_revealed: initial_tile_revealed(),
			second_tile_revealed: initial_tile_revealed(),
			delay_reset: false,
		}
	end

	def client_view(game) do

		tou = game.tile_order_unmasked #don't share with client!!!
		tm = game.tile_matched
		sc = game.score
		fr = game.first_tile_revealed
		sr = game.second_tile_revealed
		reset = game.delay_reset
		tom = game.tile_order_masked;

		%{
			tile_order_masked: tom,
			tile_matched: tm,
			score: sc,
			first_tile_revealed: fr,
			second_tile_revealed: sr,
			delay_reset: reset,
		}
	end

	def guess(game, index) do
		tou = game.tile_order_unmasked
		tm = game.tile_matched
		sc = game.score
		fr = game.first_tile_revealed
		sr = game.second_tile_revealed
		reset = game.delay_reset

		if(game.first_tile_revealed == -1) do
			#first click
			fr = index
			sc = game.score + 1
		else
			if(game.second_tile_revealed == -1) do
				#second click
				sr = index
				sc = game.score + 1
				reset = true
			else
				#2 already revealed (not sure if possible yet)
			end
		end

		tom = masked_tiles(tou, tm, fr, sr) #share this with client

		game = Map.put(game, :tile_order_masked, tom)
		game = Map.put(game, :delay_reset, reset)
		game = Map.put(game, :first_tile_revealed, fr)
		game = Map.put(game, :second_tile_revealed, sr)
		Map.put(game, :score, sc)
	end


	def refresh(game) do
		tou = game.tile_order_unmasked
		tm = game.tile_matched
		sc = game.score

		fr = game.first_tile_revealed
		sr = game.second_tile_revealed

		IO.puts(Enum.at(tou, fr))
		IO.puts(Enum.at(tou, sr))

		if Enum.at(tou, fr) == Enum.at(tou, sr) do
			tm = List.delete_at(tm, fr)
			tm = List.insert_at(tm, fr, true)
			tm = List.delete_at(tm, sr)
			tm = List.insert_at(tm, sr, true)
		end

		fr = -1
		sr = -1
		reset = false

		tom = masked_tiles(tou, tm, fr, sr) #share this with client

		game = Map.put(game, :tile_order_masked, tom)
		game = Map.put(game, :tile_matched, tm)
		game = Map.put(game, :delay_reset, reset)
		game = Map.put(game, :first_tile_revealed, fr)
		game = Map.put(game, :second_tile_revealed, sr)
		Map.put(game, :score, sc)
	end

	def restart(game) do
		new();
	end

	def initialize_matched do
		Enum.map 0..15, fn _ -> false end
	end

	def initialize_masked do
		Enum.map 0..15, fn _ -> "⚓" end
	end

	def initialize_score do
		0
	end

	def initial_tile_revealed do
		-1
	end

	def masked_tiles(tou, tm, fr, sr) do
	  tom = compare_match(tou, tm)
	  compare_revealed(tom, tou, fr, sr)
	end

	def compare_revealed(tom, tou, fr, sr) do
		if(fr != -1 && sr == -1) do
			replace_element(tom, tou, fr)
		else
			if(sr != -1) do
				tom = replace_element(tom, tou, fr)
				replace_element(tom, tou, sr)
			else
				tom
			end
		end
	end

	def replace_element(masked, unmasked, index) do
		masked = List.delete_at(masked, index)
		List.insert_at(masked, index, Enum.at(unmasked, index))
	end

  #recursive function to reveal all matched tiles to client
	def compare_match([head1|tail1], [head2|tail2]) do
		if(head2 == false) do
			["⚓" | compare_match(tail1, tail2)]
		else
			[head1 | compare_match(tail1, tail2)]
		end
	end

	def compare_match([], second_list) do
		[]
	end


  #sorts tiles at beginning for random game
	def initialize_tiles do
		tiles = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"]
		Enum.shuffle(tiles)
	end
end