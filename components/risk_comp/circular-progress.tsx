interface CircularProgressProps {
    value: number
    size?: number
    strokeWidth?: number
    className?: string
  }
  
  export function CircularProgress({
    value,
    size = 160,
    strokeWidth = 12,
    className = "",
  }: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference
  
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className={`-rotate-90 ${className}`}
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            className="stroke-muted"
            fill="none"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-500 ease-in-out"
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
      </div>
    )
  }
  