package com.hortonworks.digitalemil.hortonsgym;

public class ColorInfo {
	protected String user;
	protected String color;
	protected long time;
	
	public ColorInfo(String u, String c) {
		user= u;
		color= c;
		time= System.currentTimeMillis();
	}
	
	public String toString() {
		if(System.currentTimeMillis()- time> 200000) 
			return "0x80FFFFFF";
		return color;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((user == null) ? 0 : user.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ColorInfo other = (ColorInfo) obj;
		if (user == null) {
			if (other.user != null)
				return false;
		} else if (!user.equals(other.user))
			return false;
		return true;
	}
	
	
}
