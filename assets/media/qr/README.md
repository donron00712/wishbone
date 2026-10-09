# The trial-run QR code

Print **`qr-slip.svg`**. The rest of this file is why, and the constraints the
printer has to hold to.

Both SVGs are sized at **25 mm square including the quiet zone** and are
vector, so they scale cleanly — but read the minimum size below before
scaling down. The PNGs are 600 dpi and exist only for a printer who cannot
place vector.

| file | encodes | symbol | ec | module @ 25 mm |
|---|---|---|---|---|
| `qr-slip.svg` | `https://sweetslips.co/go` | 29×29 (v3) | H | 0.676 mm |
| `qr-slip-compact.svg` | `HTTPS://SWEETSLIPS.CO/GO` | 25×25 (v2) | Q | 0.758 mm |

`qr-slip-compact` is the fallback for a slip that cannot give the code 20 mm.
Uppercase keeps the URL in the QR alphanumeric character set, which packs it
into a smaller symbol and so buys 12% larger modules at the same printed size.
A URI scheme is case-insensitive, so `HTTPS://` is valid and every scanner
tested opens it — but it is unusual enough that the lowercase version is the
default and this one is the exception.

Neither file names a food, and neither carries a logo. See below.

## Rules the print has to hold

- **Ask for 20 mm square.** The floors are lower and were measured, not
  guessed — simulated at a phone's capture resolution with soft focus and
  grey-on-grey contrast. `qr-slip` decoded at 15 mm and failed at 12 mm;
  `qr-slip-compact`, with fewer and so larger modules, held to 12 mm. Neither
  floor has any margin in it, and a floor is not a target.
- **Keep the quiet zone.** The 4-module white margin is part of the code, not
  padding around it. It is already inside the file. Do not crop to the black
  edge, and do not let type or a rule encroach on it.
- **Nothing in the middle. No logo, no brand mark, no die-cut.** Centre damage
  failed at 15% in testing, worse than any other location except the corner
  squares. This is the one request a designer will make and the one that must
  be refused.
- **Do not touch the three corner squares.** They are how a scanner finds the
  code. Damage there is unrecoverable at any error-correction level — the
  decoder never locates the symbol, so the error correction never runs.
- **If it is ever regenerated elsewhere, set error correction to H.** It is
  free and generators default low. The code produced by a third-party site
  for this campaign came back at level M: the same 25x25 symbol as
  `qr-slip-compact` at level Q, tolerating a third less damage — 10% against
  15% — for a setting that cost nothing to ask for. Set the margin to 4 while
  there, and never accept a "dynamic" or "trackable" code, which encodes the
  generator's short link instead of ours and dies with their free trial.
- **Black on white, or near enough.** The files ship pure `#000` on `#fff`. If
  the brand palette is wanted instead, the dark must stay genuinely dark;
  verify by decoding the proof, not by eye.
- **Do not regenerate it by hand.** `node`/`segno` reproduction aside, the
  destination is a redirect, so the code never needs to change — see below.

## Why the code points at /go and not at the client

`sweetslips.co/go` 302s to whatever `GO_DESTINATION` is set to, so:

- the destination can change without reprinting a slip
- the scan is counted on our own server, which is the number being sold
- a dead client URL is a one-line fix, not a dead code in every pocket

302 and `Cache-Control: no-store`, both deliberate. A 301 would be cached by
browsers and intermediaries, so a later change of destination would never
reach anyone who had already scanned. On a printed code that is unrecoverable.

Verify a proof before the run by decoding it off the printed sheet, not off
the screen.
