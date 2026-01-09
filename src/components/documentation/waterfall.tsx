export default function Waterfall({ approach }: { approach: string[] }) {

  return (
    <div
      className="flex items-center py-4"
    >
      <div className="space-y-2 w-full">
        {approach.map((step, index) => (
          <div key={index} className="flex items-center rounded-full border border-border shadow-sm w-full">
            {/* Step number */}
            <div className="flex-shrink-0 p-2 pt-1.5 pb-2.5 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm z-10">
              <div className="w-4 h-4 flex items-center justify-center">{index + 1}</div>
            </div>

            {/* Step content */}
            <div className="ml-4 flex-grow">
              <div>
                <p className="text-sm pb-1">{step}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}