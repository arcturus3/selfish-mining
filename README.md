# Selfish Mining Attacks on Blockchains, Visualized

## Mining Backend

This repo provides code for directly simulating a selfish mining attack on a real, simplified blockchain. Blocks are actually mined using their hashes, and mining order is determined by the relative hash power of each miner. This code supports an unlimited number of honest and adversarial miners (given that their fractional hash power sums to 1).

- To run the mining backend, first install the python libraries in `mining/requirements.txt`.
- Next, run `python mining/server.py`

### Endpoints


<summary><code>GET</code> <code><b>/start</b></code> <code>(Start Mining with defaults)</code></summary>

<details>
 <summary><code>POST</code> <code><b>/start</b></code> <code>(Start Mining with Custom Params)</code></summary>

##### Body (As JSON)

> | name              |  type     | data type      | description                         |
> |-------------------|-----------|----------------|-------------------------------------|
> | `honest_power` |  required | list[int]   | List of honest mining powers        |
> | `adversarial_power` |  required | list[int]   | List of adversarial mining powers        |
> | ^^ Must sum to 1 |
> | `difficulty` |  optional | str   | Difficulty, EX: 0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff        |

###### Example:
```
{"honest_power":[0.2,0.1], "adversarial_power":[0.7], "difficulty":"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"}
```

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `text/plain;charset=UTF-8`        | `Started!`                                                         |
> | `400`         | `application/json`                | `Hash power does not sum to 1`                            |

</details>

 <summary><code>GET</code> <code><b>/stop</b></code> <code>(Stop Mining)</code></summary>

 <summary><code>GET</code> <code><b>/restart</b></code> <code>(Restart Mining - Call /start afterwards)</code></summary>

 <summary><code>GET</code> <code><b>/blockchain</b></code> <code>(Get String representation of the Blockchain)</code></summary>

 <summary><code>GET</code> <code><b>/chain-quality</b></code> <code>(Get chain quality as a decimal)</code></summary>

 <summary><code>GET</code> <code><b>/longest-chain</b></code> <code>(Get block hashes of the longest chain)</code></summary>

## Visualization

### Setup

1. Install packages with `npm install`
2. Start the development server with `npm run dev`

### Usage

- Set the mining difficulty (higher leads to longer mining time)
- Add some number of miners, set their hash powers as fractions which sum to 1, and choose which should be adversarial
- Start mining, and stop mining to change simulation parameters again
- The gray block is the genesis block
- White blocks are blocks mined by honest nodes
- Red blocks are published blocks mined by adversarial nodes
- Yellow blocks are unpublished blocks mined by adversarial nodes
- Block numbers are effectively the miner address, referring to the nth honest or adversarial miner
