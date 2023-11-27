# Selfish Mining Attacks on Blockchains, Visualized

## Mining Backend

- To run the mining backend, first install the python libraries in ``mining/requirements.txt``. 
- Next, run ``python mining/server.py``

### Endpoints


<details>
 <summary><code>GET</code> <code><b>/start</b></code> <code>(Start Mining)</code></summary>

<!-- ##### Parameters

> | name              |  type     | data type      | description                         |
> |-------------------|-----------|----------------|-------------------------------------|
> | `stub_numeric_id` |  required | int ($int64)   | The specific stub numeric id        |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `text/plain;charset=UTF-8`        | YAML string                                                         |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            | -->

</details>


<details>
 <summary><code>POST</code> <code><b>/start</b></code> <code>(Start Mining)</code></summary>

##### Body (As JSON)

> | name              |  type     | data type      | description                         |
> |-------------------|-----------|----------------|-------------------------------------|
> | `honest_power` |  required | list[int]   | List of honest mining powers        |
> | `adversarial_power` |  required | list[int]   | List of adversarial mining powers        |
> | ^^ Must sum to 1 |
> | `difficulty` |  optional | str   | Difficulty, EX: 0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff        |

###### Example: ```{"honest_power":[0.2,0.1], "adversarial_power":[0.7], "difficulty":"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"}```

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `text/plain;charset=UTF-8`        | `Started!`                                                         |
> | `400`         | `application/json`                | `Hash power does not sum to 1`                            |

</details>


<details>
 <summary><code>GET</code> <code><b>/stop</b></code> <code>(Stop Mining)</code></summary>
</details>

<details>
 <summary><code>GET</code> <code><b>/restart</b></code> <code>(Restart Mining - Call /start afterwards)</code></summary>
</details>


<details>
 <summary><code>GET</code> <code><b>/blockchain</b></code> <code>(Get String representation of the Blockchain)</code></summary>
</details>


<details>
 <summary><code>GET</code> <code><b>/chain-quality</b></code> <code>(Get chain quality as a decimal)</code></summary>
</details>


<details>
 <summary><code>GET</code> <code><b>/longest-chain</b></code> <code>(Get block hashes of the longest chain)</code></summary>
</details>

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
