import { useState, useEffect } from "react";
import { useControls, button, folder } from "leva";
import axiosContext from "axios";
import { Blocktree, Hash, Block, Blocks } from "./Blocktree";
import data from "../data.json";

import {v4 as uuid} from 'uuid'

import {
  Checkbox,
  Container,
  Flex,
  Separator,
  Text,
  TextField,
  Theme,
  ThemePanel,
} from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";

import { enableMapSet } from "immer";
enableMapSet();

import { produce } from "immer";

const axios = axiosContext.create({
  baseURL: `http://${window.location.hostname}:8764`,
});

type Address = string;

type Miner = {
  adversary: boolean;
  hashPower: number;
};

type Miners = Map<Address, Miner>;

export const App = () => {
  const [mining, setMining] = useState(false);
  const [difficulty, setDifficulty] = useState(5)
  const [miners, setMiners] = useState<Miners>(new Map());
  const [blocks, setBlocks] = useState<Blocks>(
    () => new Map(Object.entries(data) as [Hash, Block][])
  );

  const parseBlockData = (
    data: [string | null, string],
    published: boolean
  ): Block => ({
    parent: data[0] ?? "0",
    minerType:
      data[1] === "Genesis"
        ? "genesis"
        : data[1].startsWith("Honest")
        ? "honest"
        : "adversary",
    minerAddress:
      data[1] === "Genesis"
        ? "0"
        : data[1].replace("Honest", "").replace("Adversary", ""),
    published: published,
  });

  useEffect(() => {
    const id = setInterval(async () => {
      if (mining) {
        const res = await axios.get("/blockchain");
        const blocks: Blocks = new Map();
        type BlockData = [string | null, string];
        Object.entries(res.data.published).forEach(([hash, data]) => {
          blocks.set(hash, parseBlockData(data as BlockData, true));
        });
        Object.entries(res.data.unpublished).forEach(([hash, data]) => {
          blocks.set(hash, parseBlockData(data as BlockData, false));
        });
        setBlocks(blocks);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [mining]);

  const debugAddBlock = (parentHash: Hash) => {
    setBlocks((prev) => {
      const blocks = new Map(prev);
      const hash = Math.floor(Math.random() * 1e6).toString();
      const block: Block = {
        parent: parentHash,
        minerType: "honest",
        minerAddress: "1",
        published: true,
      };
      blocks.set(hash, block);
      return blocks;
    });
  };

  return (
    <Flex height='100%'>
      <Flex justify="center" grow="1" style={{ overflow: "clip" }}>
        <Blocktree
          blocks={blocks}
          blockSize={50}
          blockGap={50}
          visibleHeight={6}
          debugAddBlock={debugAddBlock}
        />
      </Flex>
      <Flex direction="column" p="4" gap='1' style={{width: 300}}>
        {!mining ? (
          <Button
            onClick={() => {
              const honest = [...miners.values()].filter(miner => !miner.adversary)
              const adversary = [...miners.values()].filter(miner => miner.adversary)
              axios.post("/start", {
                difficulty: '0'.repeat(difficulty) + 'f',
                honest_power: honest.map(miner => miner.hashPower),
                adversarial_power: adversary.map(miner => miner.hashPower),
              });
              setMining(true);
            }}
          >
            Start mining
          </Button>
        ) : (
          <Button
            onClick={() => {
              axios.get("/restart");
              setMining(false);
            }}
          >
            Stop mining
          </Button>
        )}
        <Text as="label">
          Difficulty
          <TextField.Input
            type='number'
            value={difficulty}
            onChange={(event) => setDifficulty(parseInt(event.target.value))}
          />
        </Text>
        <Button
          onClick={() => {
            setMiners(
              produce((prev) => {
                prev.set(uuid(), { adversary: false, hashPower: 0 });
              })
            );
          }}
        >
          Add miner
        </Button>
        {[...miners].map(([address, miner]) => (
          <Flex key={address} direction='column' gap='1'>
            <Separator orientation='horizontal' size='4' />
            <Text as="label">
              Adversary
              <Checkbox
                checked={miner.adversary}
                onCheckedChange={(checked) =>
                  setMiners(
                    produce((prev) => {
                      prev.get(address)!.adversary = checked as boolean;
                    })
                  )
                }
              />
            </Text>
            <Text as="label">
              Hash power
              <TextField.Input
                type='number'
                value={miner.hashPower}
                onChange={(event) =>
                  setMiners(
                    produce((prev) => {
                      prev.get(address)!.hashPower = parseFloat(
                        event.target.value
                      );
                    })
                  )
                }
              />
            </Text>
            <Button
              onClick={() => {
                setMiners(
                  produce((prev) => {
                    prev.delete(address);
                  })
                );
              }}
            >
              Remove miner
            </Button>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
