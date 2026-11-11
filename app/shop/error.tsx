"use client";
export default function Error({ reset }: { reset: () => void }) { return <main className="section empty-state"><h1>The shelves could not load.</h1><p>Please try again or call the store at (507) 720-5306.</p><button onClick={reset}>Try again</button></main>; }
